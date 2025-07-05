# Tokenized Digital Art Provenance System

A comprehensive blockchain-based system for managing digital art provenance, ownership, and licensing using Clarity smart contracts on the Stacks blockchain.

## Overview

This system consists of five independent smart contracts that work together to provide complete digital art lifecycle management:

1. **Creation Timestamp Contract** - Records artwork origination and creation details
2. **Ownership History Contract** - Tracks all previous owners and transfers
3. **Authenticity Verification Contract** - Prevents art forgery through verification mechanisms
4. **Royalty Enforcement Contract** - Ensures artist compensation on secondary sales
5. **Exhibition Licensing Contract** - Manages display permissions and licensing

## Key Features

- **Immutable Provenance**: All artwork creation and ownership data is permanently recorded
- **Forgery Prevention**: Multi-layered authenticity verification system
- **Artist Royalties**: Automatic royalty distribution on secondary market sales
- **Licensing Management**: Granular control over exhibition and display rights
- **Decentralized**: No single point of failure or control

## Contract Architecture

### Creation Timestamp Contract
- Records artwork metadata and creation timestamp
- Establishes original creator identity
- Generates unique artwork identifiers
- Immutable creation records

### Ownership History Contract
- Tracks complete ownership chain
- Records transfer timestamps and prices
- Maintains ownership verification
- Supports ownership queries

### Authenticity Verification Contract
- Multi-signature verification system
- Expert validator network
- Authenticity scoring mechanism
- Fraud prevention measures

### Royalty Enforcement Contract
- Configurable royalty percentages
- Automatic distribution to artists
- Secondary sale tracking
- Payment verification

### Exhibition Licensing Contract
- Time-bound licensing agreements
- Geographic restrictions
- Usage type permissions
- Revenue sharing for exhibitions

## Getting Started

### Prerequisites
- Stacks blockchain node
- Clarity development environment
- Node.js for testing

### Installation

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Run tests: \`npm test\`
4. Deploy contracts to testnet/mainnet

### Usage

Each contract can be deployed independently and used standalone or in combination with others. See individual contract documentation for specific usage patterns.

## Testing

The system includes comprehensive test suites using Vitest:

\`\`\`bash
npm test
\`\`\`

Tests cover:
- Contract deployment
- Function execution
- Error handling
- Edge cases
- Integration scenarios

## Security Considerations

- All contracts are designed to be immutable once deployed
- Multi-signature requirements for critical operations
- Input validation and sanitization
- Access control mechanisms
- Economic incentives for honest behavior

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

