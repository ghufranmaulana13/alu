// ==========================================================================
// ALTURA WEB3 GAMING - INTERACTIVE APP LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSupportedChains();
  initCodePlayground();
  initPasscodeGuard();
  initHeaderScroll();
});

// 1. HERO SMART NFT SIMULATOR
const heroNFTState = {
  name: "Dragon Slayer Blade",
  level: 50,
  attack: 450,
  durability: 98,
  element: "Fire / Plasma",
  enchantment: "Dragon Scale Flame",
  rarity: "LEGENDARY"
};

function simulateHeroNFT(action) {
  const lvlEl = document.getElementById('hero-nft-lvl');
  const atkEl = document.getElementById('hero-nft-atk');
  const durEl = document.getElementById('hero-nft-dur');
  const jsonEl = document.getElementById('hero-json-output');

  if (action === 'levelUp') {
    heroNFTState.level += 5;
    heroNFTState.attack += 50;
  } else if (action === 'enchant') {
    heroNFTState.enchantment = "Inferno Lightning +9";
    heroNFTState.attack += 120;
    heroNFTState.element = "Plasma / Cosmic Lightning";
  } else if (action === 'damage') {
    heroNFTState.durability = Math.max(10, heroNFTState.durability - 15);
  } else if (action === 'reset') {
    heroNFTState.level = 50;
    heroNFTState.attack = 450;
    heroNFTState.durability = 98;
    heroNFTState.element = "Fire / Plasma";
    heroNFTState.enchantment = "Dragon Scale Flame";
  }

  if (lvlEl) lvlEl.innerText = heroNFTState.level;
  if (atkEl) atkEl.innerText = `+${heroNFTState.attack}`;
  if (durEl) durEl.innerText = `${heroNFTState.durability}%`;

  if (jsonEl) {
    const updatedPayload = {
      asset_id: "altura-nft-883912",
      name: heroNFTState.name,
      smart_properties: {
        level: heroNFTState.level,
        attack_power: heroNFTState.attack,
        durability: `${heroNFTState.durability}%`,
        element: heroNFTState.element,
        enchantment: heroNFTState.enchantment,
        last_updated: new Date().toISOString()
      },
      chain_id: 137,
      owner: "0x7F9...3A19"
    };
    jsonEl.innerText = JSON.stringify(updatedPayload, null, 2);
  }
}

// 2. FEATURE 1: SMART NFT SANDBOX
function updateSmartNFT(mode) {
  const fillShield = document.getElementById('fill-shield');
  const fillPower = document.getElementById('fill-power');
  const smartRarity = document.getElementById('smart-rarity');
  const smartName = document.getElementById('smart-name');

  // Remove active buttons styling
  document.querySelectorAll('.radio-buttons .btn-option').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (mode === 'base') {
    fillShield.style.width = '75%';
    fillPower.style.width = '60%';
    smartRarity.innerText = 'EPIC';
    smartRarity.style.background = '#8b5cf6';
    smartName.innerText = 'Exo-Titan Mech Armor';
  } else if (mode === 'overdrive') {
    fillShield.style.width = '100%';
    fillPower.style.width = '100%';
    smartRarity.innerText = 'OVERCHARGED';
    smartRarity.style.background = '#00f0ff';
    smartName.innerText = 'Exo-Titan Mech Armor [OVERDRIVE]';
  } else if (mode === 'damaged') {
    fillShield.style.width = '20%';
    fillPower.style.width = '35%';
    smartRarity.innerText = 'CRITICAL DAMAGE';
    smartRarity.style.background = '#ff007a';
    smartName.innerText = 'Exo-Titan Mech Armor (Damaged)';
  }
}

function updateSmartNFTLevel(val) {
  const levelDisplay = document.getElementById('level-display');
  if (levelDisplay) levelDisplay.innerText = val;
}

// 3. ALTURA GUARD II PASSCODE LOGIC
function initPasscodeGuard() {
  const pinContainer = document.getElementById('pin-container');
  if (!pinContainer) return;

  const inputs = pinContainer.querySelectorAll('.pin-digit');
  const statusMsg = document.getElementById('guard-status-msg');

  inputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1) {
        if (idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        } else {
          // All 5 digits entered
          input.blur();
          verifyPasscode(inputs, statusMsg);
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });
}

function verifyPasscode(inputs, statusMsg) {
  statusMsg.innerHTML = "⏳ Signing transaction on-chain via Altura Enclave...";
  statusMsg.className = "guard-status";

  setTimeout(() => {
    statusMsg.innerHTML = "✅ <strong>Transaction Confirmed!</strong> Item transferred to player inventory. TX Hash: 0x9a3f...12c9";
    statusMsg.className = "guard-status success";
  }, 900);
}

// 4. CODE PLAYGROUND TAB SWITCHER & RUNNER
const codeSnippets = {
  unity: `// Unity C# SDK Example
using AlturaSDK;

public class GameInventory : MonoBehaviour 
{
    async void Start() 
    {
        // Initialize Altura Client
        var altura = new AlturaClient("YOUR_API_KEY");

        // Mint Smart NFT to Player Wallet
        var tx = await altura.MintItem(
            userAddress: "0x7F9...3A19",
            collectionId: "0x8891...",
            itemAmount: 1
        );

        Debug.Log("NFT Minted Successfully! TX: " + tx.hash);
    }
}`,

  unreal: `// Unreal Engine 5 C++ Integration
#include "AlturaClient.h"

void AWeb3GameGameMode::MintWeapon(FString PlayerWallet) 
{
    FAlturaConfig Config;
    Config.ApiKey = TEXT("YOUR_API_KEY");
    
    UAlturaSDK* Altura = UAlturaSDK::Initialize(Config);
    Altura->MintSmartNFT(PlayerWallet, TEXT("ITEM_ID_883"), 1, [](FString TxHash) {
        UE_LOG(LogTemp, Log, TEXT("Smart NFT Minted! TX: %s"), *TxHash);
    });
}`,

  js: `// Node.js / JavaScript Web3 Integration
import { Altura } from "@alturagaming/altura-sdk";

const altura = new Altura("YOUR_API_KEY");

async function mintPlayerItem() {
  const item = await altura.mintItem({
    userAddress: "0x7F9...3A19",
    collectionAddress: "0x8891...c902",
    amount: 1,
    properties: { level: 50, attack: 450 }
  });

  console.log("Mint success:", item.transactionHash);
}

mintPlayerItem();`,

  rest: `# REST API (cURL Endpoint)
curl -X POST https://api.alturagaming.com/v2/item/mint \
  -H "API-KEY: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x7F9...3A19",
    "collectionId": "0x8891...c902",
    "amount": 1
  }'`
};

function initCodePlayground() {
  const engineTabs = document.getElementById('engine-tabs');
  const codeDisplay = document.querySelector('#code-snippet-display');
  const btnRun = document.getElementById('btn-run-code');
  const btnCopy = document.getElementById('btn-copy-code');
  const consoleOutput = document.getElementById('console-output');

  if (!engineTabs) return;

  let currentEngine = 'unity';

  engineTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      engineTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      currentEngine = e.target.getAttribute('data-engine');
      codeDisplay.innerText = codeSnippets[currentEngine];
    }
  });

  if (btnRun) {
    btnRun.addEventListener('click', () => {
      consoleOutput.innerText = `[ALTURA SDK] Executing request for engine: ${currentEngine.toUpperCase()}...`;
      
      setTimeout(() => {
        consoleOutput.innerText = `STATUS: 200 OK
LATENCY: 42ms
HTTP_RESPONSE:
{
  "status": "success",
  "transaction_hash": "0x98f219c08471a100a98fe37b129",
  "minted_to": "0x7F9...3A19",
  "smart_nft_id": "altura-nft-883912",
  "chain": "Polygon (137)",
  "gas_used": "0.0012 MATIC"
}`;
      }, 500);
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(codeDisplay.innerText);
      btnCopy.innerText = "Copied! ✅";
      setTimeout(() => { btnCopy.innerText = "Copy Code 📋"; }, 2000);
    });
  }
}

// 5. CHAINS GRID DATA & FILTERING
const chainsData = [
  { name: "Ethereum", type: "l1 evm", icon: "⚡", speed: "< 12s finality" },
  { name: "Polygon EVM", type: "l2 evm", icon: "🟣", speed: "< 2s finality" },
  { name: "BNB Chain", type: "l1 evm", icon: "🟡", speed: "< 3s finality" },
  { name: "Arbitrum", type: "l2 evm", icon: "🔵", speed: "< 1s finality" },
  { name: "Avalanche", type: "l1 evm", icon: "🔴", speed: "< 1s finality" },
  { name: "Solana", type: "l1", icon: "🟢", speed: "< 400ms finality" },
  { name: "Immutable", type: "l2 evm", icon: "🔹", speed: "< 1s finality" },
  { name: "Optimism", type: "l2 evm", icon: "⚡", speed: "< 1s finality" },
  { name: "Base L2", type: "l2 evm", icon: "⚪", speed: "< 1s finality" },
  { name: "Fantom", type: "l1 evm", icon: "👻", speed: "< 1s finality" },
  { name: "Sui Network", type: "l1", icon: "💧", speed: "< 500ms finality" },
  { name: "Cronos", type: "l1 evm", icon: "🦁", speed: "< 2s finality" },
];

function initSupportedChains() {
  const grid = document.getElementById('chains-grid');
  if (!grid) return;

  renderChains(chainsData);
}

function renderChains(data) {
  const grid = document.getElementById('chains-grid');
  grid.innerHTML = data.map(c => `
    <div class="chain-card">
      <div class="chain-icon">${c.icon}</div>
      <div class="chain-info">
        <h4>${c.name}</h4>
        <span>${c.speed}</span>
      </div>
    </div>
  `).join('');
}

function filterChains(filter) {
  document.querySelectorAll('.chain-filters .filter-chip').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (filter === 'all') {
    renderChains(chainsData);
  } else {
    const filtered = chainsData.filter(c => c.type.includes(filter));
    renderChains(filtered);
  }
}

// 6. HEADER SCROLL & MOBILE TOGGLE
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(4, 7, 17, 0.95)';
      header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
      header.style.background = 'rgba(4, 7, 17, 0.8)';
      header.style.boxShadow = 'none';
    }
  });
}

function handleSignup(e) {
  e.preventDefault();
  const emailInput = document.getElementById('cta-email');
  if (emailInput && emailInput.value) {
    alert(`⚡ Thank you! Developer API Key sent to: ${emailInput.value}`);
    emailInput.value = '';
  }
}
