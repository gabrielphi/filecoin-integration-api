# 🌉 Synapse Vault: Frictionless Web3 Storage Bridge

![Architecture](https://img.shields.io/badge/Architecture-Middleware_Pattern-blueviolet?style=for-the-badge)
![FVM Integration](https://img.shields.io/badge/FVM-Deep_Integration-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Deploy-Production_Ready-2496ED?style=for-the-badge)

# Infrastructure Provisioning (Pre-Flight) 

Before starting the container (**Runtime**), it is necessary to provision the on-chain identity and liquidity that the Gateway will use to operate the "Gas Station" pattern.

## 1. Wallet Setup (Identity) 

The system requires an EVM-Compatible Wallet (such as MetaMask) to act as the paying agent. Configure your wallet with the following network details:

| Parameter | Value |
| :--- | :--- |
| **Network** | Filecoin Calibration Testnet |
| **Chain ID** | `314159` |
| **Currency Symbol** | tFIL |
| **RPC URL** | `https://api.calibration.node.glif.io/rpc/v1` |

## 2. Liquidity Injection (Gas & Storage) 

The **Synapse Vault** operates with two distinct assets on the FVM (Filecoin Virtual Machine). The wallet must be funded in advance to ensure operation:

| Asset | Technical Function | Source (Faucets) |
| :--- | :--- | :--- |
| **tFIL** | **Gas Fees:** Pays for FVM computation and network messages. | [Calibration Faucet (Filfox)](https://faucet.calibration.filfox.info/) |
| **USDFC** | **Storage Payment:** ERC-20 token used in the Synapse contract to pay for disk space. | [USDFC Faucet Link](https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc) |

---
> **Note:** Ensure the wallet has sufficient balance of both assets before triggering initialization scripts.

> **Bridging the Gap.** A production-ready middleware that enables any Web2 enterprise system to utilize Filecoin's decentralized storage without managing wallets, gas fees, or cryptographic signatures.

---

## 🎯 The Strategic Value
**The Barrier:** Enterprise adoption of Filecoin is hindered by the complexity of client-side wallet management, gas estimation (tFIL), and storage payment (USDFC) mechanics.
**Our Solution:** A containerized **"Gas Station & Gateway"** pattern. We abstract the Synapse Protocol into a high-performance REST API.

* **Client Experience:** Sends JSON (Base64). Receives CID. **Zero blockchain knowledge required.**
* **Backend Engineering:** Handles atomic locking, allowance approvals, and sector sealing automatically.

---

## 🏗️ Architecture & Implementation

We leveraged **Next.js 16 (Server Actions)** wrapped in **Docker** to create a secure execution environment for the **Synapse SDK**.

```mermaid
graph LR
    A[Web2 Client / Legacy App] -->|POST JSON + API_KEY| B(Docker Container)
    subgraph "Synapse Vault Core"
    B -->|1. Auth & Validation| C{Middleware}
    C -->|2. Load Isolated Wallet| D[Synapse SDK Instance]
    D -->|3. Check USDFC/tFIL Liquidity| E[Payment Logic]
    E -->|4. Atomic Approval (FVM)| F[Smart Contract]
    D -->|5. Upload & Seal| G[Storage Provider]
    end
    G -->|6. Return PieceCID| A