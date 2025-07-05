;; Ownership History Contract
;; Tracks all previous owners and transfers

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u200))
(define-constant ERR_ARTWORK_NOT_FOUND (err u201))
(define-constant ERR_INVALID_TRANSFER (err u202))
(define-constant ERR_ALREADY_OWNER (err u203))
(define-constant ERR_INVALID_PRICE (err u204))

;; Data Variables
(define-data-var next-transfer-id uint u1)

;; Data Maps
(define-map current-owners
  { artwork-id: uint }
  {
    owner: principal,
    acquired-at: uint,
    acquisition-price: uint
  }
)

(define-map ownership-transfers
  { transfer-id: uint }
  {
    artwork-id: uint,
    from-owner: principal,
    to-owner: principal,
    transfer-timestamp: uint,
    sale-price: uint,
    transfer-type: (string-ascii 20)
  }
)

(define-map artwork-transfer-history
  { artwork-id: uint, transfer-id: uint }
  { timestamp: uint }
)

(define-map owner-portfolio
  { owner: principal, artwork-id: uint }
  {
    acquired-at: uint,
    is-current-owner: bool
  }
)

(define-map transfer-counts
  { artwork-id: uint }
  { count: uint }
)

;; Public Functions

;; Initialize artwork ownership (first owner)
(define-public (initialize-ownership
  (artwork-id uint)
  (initial-owner principal)
  (initial-price uint))
  (let
    (
      (timestamp (unwrap-panic (get-block-info? time (- block-height u1))))
      (transfer-id (var-get next-transfer-id))
    )
    ;; Check if artwork already has an owner
    (asserts! (is-none (map-get? current-owners { artwork-id: artwork-id })) ERR_ALREADY_OWNER)

    ;; Set initial owner
    (map-set current-owners
      { artwork-id: artwork-id }
      {
        owner: initial-owner,
        acquired-at: timestamp,
        acquisition-price: initial-price
      }
    )

    ;; Record initial ownership transfer
    (map-set ownership-transfers
      { transfer-id: transfer-id }
      {
        artwork-id: artwork-id,
        from-owner: tx-sender,
        to-owner: initial-owner,
        transfer-timestamp: timestamp,
        sale-price: initial-price,
        transfer-type: "initial"
      }
    )

    ;; Update transfer history
    (map-set artwork-transfer-history
      { artwork-id: artwork-id, transfer-id: transfer-id }
      { timestamp: timestamp }
    )

    ;; Update owner portfolio
    (map-set owner-portfolio
      { owner: initial-owner, artwork-id: artwork-id }
      {
        acquired-at: timestamp,
        is-current-owner: true
      }
    )

    ;; Update transfer count
    (map-set transfer-counts
      { artwork-id: artwork-id }
      { count: u1 }
    )

    ;; Increment transfer ID
    (var-set next-transfer-id (+ transfer-id u1))

    (ok transfer-id)
  )
)

;; Transfer ownership
(define-public (transfer-ownership
  (artwork-id uint)
  (new-owner principal)
  (sale-price uint)
  (transfer-type (string-ascii 20)))
  (let
    (
      (current-ownership (unwrap! (map-get? current-owners { artwork-id: artwork-id }) ERR_ARTWORK_NOT_FOUND))
      (current-owner (get owner current-ownership))
      (timestamp (unwrap-panic (get-block-info? time (- block-height u1))))
      (transfer-id (var-get next-transfer-id))
      (current-count (default-to u0 (get count (map-get? transfer-counts { artwork-id: artwork-id }))))
    )
    ;; Verify caller is current owner
    (asserts! (is-eq tx-sender current-owner) ERR_UNAUTHORIZED)
    (asserts! (not (is-eq current-owner new-owner)) ERR_ALREADY_OWNER)
    (asserts! (>= sale-price u0) ERR_INVALID_PRICE)

    ;; Update current owner
    (map-set current-owners
      { artwork-id: artwork-id }
      {
        owner: new-owner,
        acquired-at: timestamp,
        acquisition-price: sale-price
      }
    )

    ;; Record transfer
    (map-set ownership-transfers
      { transfer-id: transfer-id }
      {
        artwork-id: artwork-id,
        from-owner: current-owner,
        to-owner: new-owner,
        transfer-timestamp: timestamp,
        sale-price: sale-price,
        transfer-type: transfer-type
      }
    )

    ;; Update transfer history
    (map-set artwork-transfer-history
      { artwork-id: artwork-id, transfer-id: transfer-id }
      { timestamp: timestamp }
    )

    ;; Update previous owner portfolio
    (map-set owner-portfolio
      { owner: current-owner, artwork-id: artwork-id }
      {
        acquired-at: (get acquired-at current-ownership),
        is-current-owner: false
      }
    )

    ;; Update new owner portfolio
    (map-set owner-portfolio
      { owner: new-owner, artwork-id: artwork-id }
      {
        acquired-at: timestamp,
        is-current-owner: true
      }
    )

    ;; Update transfer count
    (map-set transfer-counts
      { artwork-id: artwork-id }
      { count: (+ current-count u1) }
    )

    ;; Increment transfer ID
    (var-set next-transfer-id (+ transfer-id u1))

    (ok transfer-id)
  )
)

;; Read-only Functions

;; Get current owner
(define-read-only (get-current-owner (artwork-id uint))
  (map-get? current-owners { artwork-id: artwork-id })
)

;; Get transfer details
(define-read-only (get-transfer (transfer-id uint))
  (map-get? ownership-transfers { transfer-id: transfer-id })
)

;; Get transfer count for artwork
(define-read-only (get-transfer-count (artwork-id uint))
  (default-to u0 (get count (map-get? transfer-counts { artwork-id: artwork-id })))
)

;; Verify current ownership
(define-read-only (verify-ownership (artwork-id uint) (claimed-owner principal))
  (match (map-get? current-owners { artwork-id: artwork-id })
    ownership-data (is-eq (get owner ownership-data) claimed-owner)
    false
  )
)

;; Check if user owns artwork
(define-read-only (owns-artwork (owner principal) (artwork-id uint))
  (match (map-get? owner-portfolio { owner: owner, artwork-id: artwork-id })
    portfolio-data (get is-current-owner portfolio-data)
    false
  )
)

;; Get artwork acquisition details for owner
(define-read-only (get-acquisition-details (owner principal) (artwork-id uint))
  (map-get? owner-portfolio { owner: owner, artwork-id: artwork-id })
)
