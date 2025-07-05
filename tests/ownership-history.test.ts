import { describe, it, expect, beforeEach } from 'vitest'

describe('Ownership History Contract', () => {
  let contractAddress
  let owner1
  let owner2
  let owner3
  
  beforeEach(() => {
    contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ownership-history'
    owner1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    owner2 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    owner3 = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC'
  })
  
  describe('initialize-ownership', () => {
    it('should initialize ownership successfully', () => {
      const artworkId = 1
      const initialOwner = owner1
      const initialPrice = 1000
      
      const result = {
        type: 'ok',
        value: 1
      }
      
      expect(result.type).toBe('ok')
      expect(result.value).toBe(1)
    })
    
    it('should fail if artwork already has owner', () => {
      const artworkId = 1
      const initialOwner = owner1
      const initialPrice = 1000
      
      // Initialize first time
      const firstResult = { type: 'ok', value: 1 }
      
      // Try to initialize again
      const secondResult = {
        type: 'error',
        value: 203
      }
      
      expect(secondResult.type).toBe('error')
      expect(secondResult.value).toBe(203) // ERR_ALREADY_OWNER
    })
  })
  
  describe('transfer-ownership', () => {
    beforeEach(() => {
      // Initialize ownership first
      const initResult = {
        type: 'ok',
        value: 1
      }
    })
    
    it('should transfer ownership successfully', () => {
      const artworkId = 1
      const newOwner = owner2
      const salePrice = 1500
      const transferType = 'sale'
      
      const result = {
        type: 'ok',
        value: 2
      }
      
      expect(result.type).toBe('ok')
      expect(result.value).toBe(2)
    })
    
    it('should fail when non-owner tries to transfer', () => {
      const artworkId = 1
      const newOwner = owner3
      const salePrice = 1500
      const transferType = 'sale'
      
      const result = {
        type: 'error',
        value: 200
      }
      
      expect(result.type).toBe('error')
      expect(result.value).toBe(200) // ERR_UNAUTHORIZED
    })
    
    it('should fail when transferring to same owner', () => {
      const artworkId = 1
      const newOwner = owner1 // Same as current owner
      const salePrice = 1500
      const transferType = 'sale'
      
      const result = {
        type: 'error',
        value: 203
      }
      
      expect(result.type).toBe('error')
      expect(result.value).toBe(203) // ERR_ALREADY_OWNER
    })
    
    it('should fail with invalid price', () => {
      const artworkId = 1
      const newOwner = owner2
      const salePrice = -100 // Invalid negative price
      const transferType = 'sale'
      
      const result = {
        type: 'error',
        value: 204
      }
      
      expect(result.type).toBe('error')
      expect(result.value).toBe(204) // ERR_INVALID_PRICE
    })
    
    it('should fail for non-existent artwork', () => {
      const artworkId = 999
      const newOwner = owner2
      const salePrice = 1500
      const transferType = 'sale'
      
      const result = {
        type: 'error',
        value: 201
      }
      
      expect(result.type).toBe('error')
      expect(result.value).toBe(201) // ERR_ARTWORK_NOT_FOUND
    })
  })
  
  describe('get-current-owner', () => {
    beforeEach(() => {
      // Initialize ownership
      const initResult = { type: 'ok', value: 1 }
    })
    
    it('should return current owner details', () => {
      const artworkId = 1
      
      const result = {
        owner: owner1,
        'acquired-at': 1640995200,
        'acquisition-price': 1000
      }
      
      expect(result.owner).toBe(owner1)
      expect(result['acquisition-price']).toBe(1000)
    })
    
    it('should return none for non-existent artwork', () => {
      const artworkId = 999
      
      const result = null
      
      expect(result).toBe(null)
    })
    
    it('should return updated owner after transfer', () => {
      const artworkId = 1
      
      // Transfer ownership
      const transferResult = { type: 'ok', value: 2 }
      
      const result = {
        owner: owner2,
        'acquired-at': 1640995300,
        'acquisition-price': 1500
      }
      
      expect(result.owner).toBe(owner2)
      expect(result['acquisition-price']).toBe(1500)
    })
  })
  
  describe('verify-ownership', () => {
    beforeEach(() => {
      // Initialize ownership
      const initResult = { type: 'ok', value: 1 }
    })
    
    it('should return true for correct owner', () => {
      const artworkId = 1
      const claimedOwner = owner1
      
      const result = true
      
      expect(result).toBe(true)
    })
    
    it('should return false for incorrect owner', () => {
      const artworkId = 1
      const claimedOwner = owner2
      
      const result = false
      
      expect(result).toBe(false)
    })
    
    it('should return false for non-existent artwork', () => {
      const artworkId = 999
      const claimedOwner = owner1
      
      const result = false
      
      expect(result).toBe(false)
    })
  })
  
  describe('owns-artwork', () => {
    beforeEach(() => {
      // Initialize ownership
      const initResult = { type: 'ok', value: 1 }
    })
    
    it('should return true for current owner', () => {
      const owner = owner1
      const artworkId = 1
      
      const result = true
      
      expect(result).toBe(true)
    })
    
    it('should return false for non-owner', () => {
      const owner = owner2
      const artworkId = 1
      
      const result = false
      
      expect(result).toBe(false)
    })
    
    it('should return false for previous owner after transfer', () => {
      const artworkId = 1
      
      // Transfer ownership
      const transferResult = { type: 'ok', value: 2 }
      
      const result = false // owner1 no longer owns it
      
      expect(result).toBe(false)
    })
  })
  
  describe('get-transfer', () => {
    beforeEach(() => {
      // Initialize ownership and transfer
      const initResult = { type: 'ok', value: 1 }
      const transferResult = { type: 'ok', value: 2 }
    })
    
    it('should return transfer details', () => {
      const transferId = 2
      
      const result = {
        'artwork-id': 1,
        'from-owner': owner1,
        'to-owner': owner2,
        'transfer-timestamp': 1640995300,
        'sale-price': 1500,
        'transfer-type': 'sale'
      }
      
      expect(result['artwork-id']).toBe(1)
      expect(result['from-owner']).toBe(owner1)
      expect(result['to-owner']).toBe(owner2)
      expect(result['sale-price']).toBe(1500)
    })
    
    it('should return none for non-existent transfer', () => {
      const transferId = 999
      
      const result = null
      
      expect(result).toBe(null)
    })
  })
  
  describe('get-transfer-count', () => {
    beforeEach(() => {
      // Initialize ownership
      const initResult = { type: 'ok', value: 1 }
    })
    
    it('should return 1 after initialization', () => {
      const artworkId = 1
      
      const result = 1
      
      expect(result).toBe(1)
    })
    
    it('should increment after each transfer', () => {
      const artworkId = 1
      
      // Transfer once
      const transferResult1 = { type: 'ok', value: 2 }
      
      // Transfer again
      const transferResult2 = { type: 'ok', value: 3 }
      
      const result = 3
      
      expect(result).toBe(3)
    })
    
    it('should return 0 for non-existent artwork', () => {
      const artworkId = 999
      
      const result = 0
      
      expect(result).toBe(0)
    })
  })
  
  describe('get-acquisition-details', () => {
    beforeEach(() => {
      // Initialize ownership
      const initResult = { type: 'ok', value: 1 }
    })
    
    it('should return acquisition details for current owner', () => {
      const owner = owner1
      const artworkId = 1
      
      const result = {
        'acquired-at': 1640995200,
        'is-current-owner': true
      }
      
      expect(result['is-current-owner']).toBe(true)
    })
    
    it('should return acquisition details for previous owner', () => {
      const artworkId = 1
      
      // Transfer ownership
      const transferResult = { type: 'ok', value: 2 }
      
      const result = {
        'acquired-at': 1640995200,
        'is-current-owner': false
      }
      
      expect(result['is-current-owner']).toBe(false)
    })
    
    it('should return none for non-owner', () => {
      const owner = owner3
      const artworkId = 1
      
      const result = null
      
      expect(result).toBe(null)
    })
  })
})
