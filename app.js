// app.js

// Ensure ethers.js version 6.13.2 is used
// Included in your HTML with SRI:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.2/ethers.umd.min.js" integrity="sha384-gpR0Q6Hx/O+uevlbpbANbS0LWjbejPV1sqD/8w422l/fW8whGY0EPmKw3uG7ACYP" crossorigin="anonymous"></script>

// Contract Information
const contractAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';

// GHST Token Information
const ghstContractAddress = '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7';
const ghstABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  // symbol
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
];

// Combined ABI: EscrowFacet + AavegotchiFacet + LendingFacet
const combinedABI = [
  // EscrowFacet Functions
  {
    inputs: [
      { internalType: 'uint256[]', name: '_tokenIds', type: 'uint256[]' },
      { internalType: 'address[]', name: '_erc20Contracts', type: 'address[]' },
      { internalType: 'uint256[]', name: '_values', type: 'uint256[]' },
    ],
    name: 'batchDepositERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: '_tokenIds', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_values', type: 'uint256[]' },
    ],
    name: 'batchDepositGHST',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: '_tokenIds', type: 'uint256[]' },
      { internalType: 'address[]', name: '_erc20Contracts', type: 'address[]' },
      { internalType: 'address[]', name: '_recipients', type: 'address[]' },
      { internalType: 'uint256[]', name: '_transferAmounts', type: 'uint256[]' },
    ],
    name: 'batchTransferEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'address', name: '_erc20Contract', type: 'address' },
      { internalType: 'uint256', name: '_value', type: 'uint256' },
    ],
    name: 'depositERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'address', name: '_erc20Contract', type: 'address' },
      { internalType: 'address', name: '_recipient', type: 'address' },
      { internalType: 'uint256', name: '_transferAmount', type: 'uint256' },
    ],
    name: 'transferEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // AavegotchiFacet Functions
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'allAavegotchisOfOwner',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'randomNumber', type: 'uint256' },
          { internalType: 'uint256', name: 'status', type: 'uint256' },
          { internalType: 'int16[6]', name: 'numericTraits', type: 'int16[6]' },
          { internalType: 'int16[6]', name: 'modifiedNumericTraits', type: 'int16[6]' },
          { internalType: 'uint16[16]', name: 'equippedWearables', type: 'uint16[16]' },
          { internalType: 'address', name: 'collateral', type: 'address' },
          { internalType: 'address', name: 'escrow', type: 'address' },
          { internalType: 'uint256', name: 'stakedAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'minimumStake', type: 'uint256' },
          { internalType: 'uint256', name: 'kinship', type: 'uint256' },
          { internalType: 'uint256', name: 'lastInteracted', type: 'uint256' },
          { internalType: 'uint256', name: 'experience', type: 'uint256' },
          { internalType: 'uint256', name: 'toNextLevel', type: 'uint256' },
          { internalType: 'uint256', name: 'usedSkillPoints', type: 'uint256' },
          { internalType: 'uint256', name: 'level', type: 'uint256' },
          { internalType: 'uint256', name: 'hauntId', type: 'uint256' },
          { internalType: 'uint256', name: 'baseRarityScore', type: 'uint256' },
          { internalType: 'uint256', name: 'modifiedRarityScore', type: 'uint256' },
        ],
        internalType: 'struct AavegotchiInfo[]',
        name: 'aavegotchis',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // LendingFacet Functions
  {
    inputs: [{ internalType: 'uint32', name: '_erc721TokenId', type: 'uint32' }],
    name: 'isAavegotchiLent',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Predefined ERC20 Tokens
const predefinedTokens = [
  {
    name: 'GHST',
    address: ghstContractAddress,
  },
  // Add more predefined tokens here if needed
];
// Initialize Ethers.js variables
let provider;
let signer;
let contract;
let ghstContract;
let userAddress;
let ownedAavegotchis = []; // Store owned Aavegotchis
let escrowBalances = {}; // Store balances per escrow wallet

// DOM Elements
const connectWalletButton = document.getElementById('connect-wallet');
const walletInfo = document.getElementById('wallet-info');
const networkNameDisplay = document.getElementById('network-name');
const methodFormsContainer = document.getElementById('method-forms');
const aavegotchiInfoContainer = document.getElementById('aavegotchi-info');
const toastContainer = document.getElementById('toast-container');

// Event Listeners
connectWalletButton.addEventListener('click', connectWallet);

// Constants for Rarity Farming
const RARITY_FARMING_FUNCTION = '0xea20c3c6';

// Obfuscated API Key (this is a basic obfuscation, not secure for client-side use)
const _0x5a8e = [
  '4e524e4d3347465456',
  '52131',
  '4e524654393933464b4641364634594d31424d4734504b434b',
];
(function (_0x39cef8, _0x5a8eb9) {
  const _0x41cf84 = function (_0x2839fc) {
    while (--_0x2839fc) {
      _0x39cef8['push'](_0x39cef8['shift']());
    }
  };
  _0x41cf84(++_0x5a8eb9);
})(_0x5a8e, 0xf3);
const _0x41cf = function (_0x39cef8, _0x5a8eb9) {
  _0x39cef8 = _0x39cef8 - 0x0;
  let _0x41cf84 = _0x5a8e[_0x39cef8];
  return _0x41cf84;
};
const POLYGONSCAN_API_KEY = (_0x41cf('0x0') + _0x41cf('0x2') + _0x41cf('0x1'))['replace'](
  /(.{2})/g,
  function (_0x2839fc) {
    return String['fromCharCode'](parseInt(_0x2839fc, 0x10));
  }
);

// Function to fetch rarity farming deposits
async function fetchRarityFarmingDeposits(escrowAddress) {
  const GHST_CONTRACT = ghstContractAddress; // GHST token on Polygon
  const currentTime = Math.floor(Date.now() / 1000);
  const oneYearAgo = currentTime - 365 * 24 * 60 * 60;
  const url = `https://api.polygonscan.com/api?module=account&action=tokentx&address=${escrowAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${POLYGONSCAN_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '0' && data.message === 'No transactions found') {
      console.log(`No transactions found for address: ${escrowAddress}`);
      return [];
    }

    if (data.status !== '1') {
      throw new Error(`API request failed: ${data.message}`);
    }

    const deposits = data.result.filter(
      (tx) =>
        tx.to.toLowerCase() === escrowAddress.toLowerCase() &&
        tx.contractAddress.toLowerCase() === GHST_CONTRACT.toLowerCase() &&
        parseInt(tx.timeStamp) >= oneYearAgo
    );

    return deposits.map((tx) => ({
      hash: tx.hash,
      value: ethers.formatUnits(tx.value, 18),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString(), // Only date
    }));
  } catch (error) {
    console.error('Error fetching rarity farming deposits:', error);
    return [];
  }
}
// Function to fetch all rarity farming deposits
async function fetchAllRarityFarmingDeposits(escrowAddress) {
  const GHST_CONTRACT = ghstContractAddress; // GHST token on Polygon
  const url = `https://api.polygonscan.com/api?module=account&action=tokentx&address=${escrowAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${POLYGONSCAN_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '0' && data.message === 'No transactions found') {
      console.log(`No transactions found for address: ${escrowAddress}`);
      return [];
    }

    if (data.status !== '1') {
      throw new Error(`API request failed: ${data.message}`);
    }

    const deposits = data.result.filter(
      (tx) =>
        tx.to.toLowerCase() === escrowAddress.toLowerCase() &&
        tx.contractAddress.toLowerCase() === GHST_CONTRACT.toLowerCase()
    );

    return deposits.map((tx) => ({
      hash: tx.hash,
      value: ethers.formatUnits(tx.value, 18),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString(), // Only date
    }));
  } catch (error) {
    console.error('Error fetching all rarity farming deposits:', error);
    return [];
  }
}

// Function to show deposits in a modal
function showDeposits(deposits, tokenId, name, escrowAddress) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const modalTitle = document.createElement('h2');
  modalTitle.innerText = `Rarity Farming Deposits for Aavegotchi #${tokenId} (${name})`;
  modalContent.appendChild(modalTitle);

  if (deposits.length === 0) {
    const noDepositsMessage = document.createElement('p');
    noDepositsMessage.innerText = 'No deposits found in the past year.';
    modalContent.appendChild(noDepositsMessage);
  } else {
    const depositTable = document.createElement('table');
    depositTable.className = 'deposit-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const dateHeader = document.createElement('th');
    dateHeader.innerText = 'Date';
    headerRow.appendChild(dateHeader);

    const amountHeader = document.createElement('th');
    amountHeader.innerText = 'Amount (GHST)';
    headerRow.appendChild(amountHeader);

    thead.appendChild(headerRow);
    depositTable.appendChild(thead);

    const tbody = document.createElement('tbody');

    deposits.forEach((deposit) => {
      const row = document.createElement('tr');

      const dateCell = document.createElement('td');
      dateCell.innerText = deposit.timestamp;
      row.appendChild(dateCell);

      const amountCell = document.createElement('td');
      const amountLink = document.createElement('a');
      amountLink.href = `https://polygonscan.com/tx/${deposit.hash}`;
      amountLink.target = '_blank';
      amountLink.rel = 'noopener noreferrer';
      amountLink.innerText = parseFloat(deposit.value).toFixed(2); // Rounded to two decimal places
      amountCell.appendChild(amountLink);
      row.appendChild(amountCell);

      tbody.appendChild(row);
    });

    depositTable.appendChild(tbody);
    modalContent.appendChild(depositTable);
  }

  const showAllButton = document.createElement('button');
  showAllButton.className = 'button';
  showAllButton.innerText = 'Show All Deposits';
  showAllButton.addEventListener('click', async () => {
    modalContent.removeChild(showAllButton);
    const allDeposits = await fetchAllRarityFarmingDeposits(escrowAddress);
    showDeposits(allDeposits, tokenId, name, escrowAddress);
  });
  modalContent.appendChild(showAllButton);

  const closeButton = document.createElement('button');
  closeButton.className = 'button';
  closeButton.innerText = 'Close';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });
  modalContent.appendChild(closeButton);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}
// Function to Fetch and Display Aavegotchis
async function fetchAndDisplayAavegotchis(ownerAddress) {
  try {
    ownedAavegotchis = [];
    const aavegotchis = await contract.allAavegotchisOfOwner(ownerAddress);

    if (aavegotchis.length === 0) {
      aavegotchiInfoContainer.innerHTML = '<p>No Aavegotchis found for this wallet.</p>';
      return;
    }

    const tokenContract = new ethers.Contract(selectedERC20Address, ghstABI, provider);
    const tokenDecimals = selectedERC20Decimals;
    const tokenSymbol = selectedERC20Symbol;

    const table = document.createElement('table');
    table.className = 'aavegotchi-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Token ID', 'Name', 'Escrow Wallet', `${tokenSymbol} Balance`, 'Status'];
    for (const headerText of headers) {
      const th = document.createElement('th');
      th.innerText = headerText;
      headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const balancePromises = [];
    const lendingStatusPromises = [];
    for (const aavegotchi of aavegotchis) {
      balancePromises.push(tokenContract.balanceOf(aavegotchi.escrow));
      lendingStatusPromises.push(contract.isAavegotchiLent(aavegotchi.tokenId));
    }

    const balances = await Promise.all(balancePromises);
    const lendingStatuses = await Promise.all(lendingStatusPromises);

    const ownedGotchis = [];
    const rentedGotchis = [];

    for (let index = 0; index < aavegotchis.length; index++) {
      const aavegotchi = aavegotchis[index];
      const isLent = lendingStatuses[index];
      const isOwned = !isLent;

      if (isOwned) {
        ownedAavegotchis.push(aavegotchi);
        ownedGotchis.push({
          aavegotchi,
          balance: balances[index],
          isLent,
        });
      } else {
        rentedGotchis.push({
          aavegotchi,
          balance: balances[index],
          isLent,
        });
      }
    }

    // Sort owned Gotchis by balance in descending order
    ownedGotchis.sort((a, b) => (b.balance > a.balance ? 1 : -1));

    // Combine sorted owned Gotchis with rented Gotchis
    const sortedGotchis = [...ownedGotchis, ...rentedGotchis];

    for (const { aavegotchi, balance, isLent } of sortedGotchis) {
      const row = document.createElement('tr');

      const tokenId = aavegotchi.tokenId.toString();
      const name = aavegotchi.name && aavegotchi.name.trim() !== '' ? aavegotchi.name : '(No Name)';
      const escrowWallet = aavegotchi.escrow;
      const shortEscrowWallet = `${escrowWallet.slice(0, 6)}...${escrowWallet.slice(-4)}`;

      escrowBalances[escrowWallet] = {
        tokenBalance: balance,
        tokenSymbol: tokenSymbol,
      };

      const tokenIdCell = document.createElement('td');
      tokenIdCell.setAttribute('data-label', 'Token ID');
      tokenIdCell.innerText = tokenId;
      row.appendChild(tokenIdCell);

      const nameCell = document.createElement('td');
      nameCell.setAttribute('data-label', 'Name');
      nameCell.innerText = name;
      row.appendChild(nameCell);

      const escrowCell = document.createElement('td');
      escrowCell.setAttribute('data-label', 'Escrow Wallet');
      const escrowLink = document.createElement('a');
      escrowLink.href = `https://polygonscan.com/address/${escrowWallet}`;
      escrowLink.target = '_blank';
      escrowLink.rel = 'noopener noreferrer';
      escrowLink.className = 'address-link';
      escrowLink.title = escrowWallet;
      escrowLink.innerText = shortEscrowWallet;
      escrowCell.appendChild(escrowLink);

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.setAttribute('data-copy-target', escrowWallet);
      copyButton.setAttribute('data-tooltip', 'Copy Escrow Wallet Address');
      copyButton.innerText = '📄';
      copyButton.style.marginLeft = '5px';
      escrowCell.appendChild(copyButton);

      const rarityFarmingButton = document.createElement('button');
      rarityFarmingButton.className = 'rarity-farming-button';
      rarityFarmingButton.setAttribute('data-escrow-address', escrowWallet);
      rarityFarmingButton.setAttribute('data-token-id', tokenId);
      rarityFarmingButton.setAttribute('data-gotchi-name', name);
      rarityFarmingButton.setAttribute('data-tooltip', 'View Rarity Farming Deposits');
      rarityFarmingButton.innerText = '💰';
      rarityFarmingButton.style.marginLeft = '5px';
      escrowCell.appendChild(rarityFarmingButton);

      rarityFarmingButton.addEventListener('click', async () => {
        const deposits = await fetchRarityFarmingDeposits(escrowWallet);
        showDeposits(deposits, tokenId, name, escrowWallet);
      });

      row.appendChild(escrowCell);
      const tokenBalanceRaw = balance;
      const tokenBalance = ethers.formatUnits(tokenBalanceRaw, tokenDecimals);
      const tokenBalanceCell = document.createElement('td');
      tokenBalanceCell.setAttribute('data-label', `${tokenSymbol} Balance`);

      const tokenImage = document.createElement('img');
      const imageUrl = await getTokenImageUrl(selectedERC20Address);
      tokenImage.src = imageUrl;
      tokenImage.alt = tokenSymbol;
      tokenImage.width = 24;
      tokenImage.height = 24;
      tokenImage.onerror = function () {
        this.onerror = null;
        this.src = 'path/to/default/token/image.png'; // Use a default image path
      };

      const tokenBalanceWrapper = document.createElement('div');
      tokenBalanceWrapper.className = 'token-balance';
      tokenBalanceWrapper.appendChild(tokenImage);
      tokenBalanceWrapper.appendChild(document.createTextNode(tokenBalance));

      tokenBalanceCell.appendChild(tokenBalanceWrapper);
      row.appendChild(tokenBalanceCell);

      const statusCell = document.createElement('td');
      statusCell.setAttribute('data-label', 'Status');
      if (!isLent) {
        statusCell.innerText = 'Owned';
        statusCell.className = 'status-owned';
      } else {
        statusCell.innerText = 'Rented';
        statusCell.className = 'status-rented';
      }
      row.appendChild(statusCell);

      tbody.appendChild(row);
    }

    table.appendChild(tbody);

    aavegotchiInfoContainer.innerHTML = `<h2>Your Aavegotchis:</h2>`;
    aavegotchiInfoContainer.appendChild(table);

    initializeCopyButtons();
  } catch (error) {
    console.error('Error fetching Aavegotchis:', error);
    aavegotchiInfoContainer.innerHTML = '<p>Error fetching Aavegotchis. See console for details.</p>';
  }
}

// Toast Notification Functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.classList.add(type === 'success' ? 'toast-success' : 'toast-error');
  toast.innerText = message;

  const closeButton = document.createElement('button');
  closeButton.classList.add('toast-close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    toastContainer.removeChild(toast);
  });

  toast.appendChild(closeButton);
  toastContainer.appendChild(toast);

  // Automatically remove the toast after 3 seconds
  setTimeout(() => {
    if (toastContainer.contains(toast)) {
      toastContainer.removeChild(toast);
    }
  }, 3000);
}

// Function to Connect Wallet
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    showToast('MetaMask is not installed. Please install MetaMask to use this DApp.', 'error');
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    userAddress = address;

    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    walletInfo.innerHTML = `<p>Connected Wallet Address: 
        <a href="https://polygonscan.com/address/${address}" target="_blank" rel="noopener noreferrer" class="address-link" title="${address}">
          ${shortAddress}
        </a>
      </p>`;

    const network = await provider.getNetwork();
    let networkName = 'Unknown';

    // Use BigInt for chainId comparisons
    if (network.chainId === 137n) {
      networkName = 'Polygon';
    } else if (network.chainId === 1n) {
      networkName = 'Ethereum';
    } else if (network.chainId === 80001n) {
      networkName = 'Mumbai';
    } else {
      networkName = capitalizeFirstLetter(network.name);
    }
    networkNameDisplay.innerText = `${networkName}`;

    // Enforce network selection
    if (network.chainId !== 137n) {
      showToast('Please switch to the Polygon network in MetaMask.', 'error');
      // Optionally, trigger a network switch using MetaMask's API
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // '0x89' is 137 in hexadecimal
        });
        // Reload the page after network switch
        window.location.reload();
        return;
      } catch (switchError) {
        if (switchError.code === 4902) {
          // The network is not added to MetaMask
          showToast('The Polygon network is not available in your MetaMask. Please add it manually.', 'error');
        } else {
          showToast('Failed to switch to the Polygon network. Please switch manually in MetaMask.', 'error');
        }
        return;
      }
    }

    contract = new ethers.Contract(contractAddress, combinedABI, signer);
    ghstContract = new ethers.Contract(ghstContractAddress, ghstABI, provider);

    connectWalletButton.innerText = `Connected: ${shortAddress}`;

    await fetchAndDisplayAavegotchis(address);
    await generateMethodForms(); // Generate forms after fetching Aavegotchis

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    initializeCopyButtons();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    showToast('Failed to connect wallet. See console for details.', 'error');
  }
}
// Handle Account Changes
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    walletInfo.innerHTML = '<p>Connected Wallet Address: Not connected</p>';
    networkNameDisplay.innerText = 'Not Connected';
    connectWalletButton.innerText = 'Connect Wallet';
    contract = null;
    ghstContract = null;
    methodFormsContainer.innerHTML = '';
    aavegotchiInfoContainer.innerHTML = '';
    cleanupEventListeners();
  } else {
    window.location.reload();
  }
}

// Handle Network Changes
function handleChainChanged(_chainId) {
  window.location.reload();
}

// Clean up event listeners
function cleanupEventListeners() {
  if (window.ethereum && handleAccountsChanged && handleChainChanged) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  }
}

// Function to Capitalize First Letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Global Variables for Selected ERC20 Token
let selectedERC20Address = ghstContractAddress; // Default to GHST
let selectedERC20Symbol = 'GHST';
let selectedERC20Decimals = 18;

// Function to Update Selected ERC20 Token
async function updateSelectedERC20Token(address) {
  if (!ethers.isAddress(address)) {
    showToast('Invalid ERC20 contract address.', 'error');
    return;
  }

  try {
    const tokenContract = new ethers.Contract(address, ghstABI, provider);
    selectedERC20Symbol = await tokenContract.symbol();
    selectedERC20Decimals = await tokenContract.decimals();
    selectedERC20Address = address;

    // Update the table header
    const tableHeader = document.querySelector('.aavegotchi-table th:nth-child(4)');
    if (tableHeader) {
      tableHeader.innerText = `${selectedERC20Symbol} Balance`;
    }

    // Refresh the table balances
    await refreshTableBalances();
  } catch (error) {
    console.error('Error fetching ERC20 token details:', error);
    showToast(
      'Failed to fetch ERC20 token details. Ensure the address is correct and the token follows the ERC20 standard.',
      'error'
    );
  }
}
// Function to Generate Method Forms
async function generateMethodForms() {
  methodFormsContainer.innerHTML = '';
  if (!contract) {
    methodFormsContainer.innerHTML = '<p>Please connect your wallet to interact with the contract.</p>';
    return;
  }

  const selectedFacet = 'EscrowFacet';
  const facetMethods = getFacetMethods(selectedFacet);

  if (!facetMethods) {
    methodFormsContainer.innerHTML = '<p>No methods found for the selected facet.</p>';
    return;
  }

  const mainMethodNames = ['transferEscrow'];
  const extraMethodNames = ['batchTransferEscrow', 'batchDepositERC20', 'batchDepositGHST', 'depositERC20'];

  for (const methodName of mainMethodNames) {
    const method = facetMethods[methodName];
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const formHeader = document.createElement('div');
    formHeader.className = 'form-header';

    const formTitle = document.createElement('h3');
    formTitle.innerText = 'Withdraw (TransferEscrow)';
    formHeader.appendChild(formTitle);
    formContainer.appendChild(formHeader);

    const form = document.createElement('form');
    form.setAttribute('data-method', methodName);
    form.addEventListener('submit', handleFormSubmit);

    for (const input of method.inputs) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', input.name);

      if (methodName === 'transferEscrow') {
        if (input.name === '_tokenId') {
          label.innerText = 'Select Aavegotchi:';
        } else if (input.name === '_erc20Contract') {
          label.innerText = 'ERC20 Contract Address:';
        } else if (input.name === '_transferAmount') {
          label.innerText = 'Withdraw Amount:';

          const maxButton = document.createElement('button');
          maxButton.type = 'button';
          maxButton.className = 'max-button';
          maxButton.innerText = 'Max';
          maxButton.addEventListener('click', async () => {
            await handleMaxButtonClick(form);
          });
          label.appendChild(maxButton);
        } else {
          label.innerText = `${input.name} (${input.type}):`;
        }
      } else {
        label.innerText = `${input.name} (${input.type}):`;
      }

      formGroup.appendChild(label);

      let inputElement;
      if (input.name === '_tokenId') {
        inputElement = document.createElement('select');
        inputElement.className = 'select';
        inputElement.id = input.name;
        inputElement.name = input.name;

        if (ownedAavegotchis.length > 1) {
          const allOption = document.createElement('option');
          allOption.value = 'all';
          allOption.innerText = 'All Owned Aavegotchis';
          inputElement.appendChild(allOption);
        }

        for (const aavegotchi of ownedAavegotchis) {
          const option = document.createElement('option');
          option.value = aavegotchi.tokenId.toString();
          const name = aavegotchi.name && aavegotchi.name.trim() !== '' ? aavegotchi.name : '(No Name)';
          option.innerText = `Aavegotchi ID ${aavegotchi.tokenId} (${name})`;
          inputElement.appendChild(option);
        }

        if (ownedAavegotchis.length === 0) {
          const option = document.createElement('option');
          option.value = '';
          option.innerText = 'No owned Aavegotchis available';
          inputElement.appendChild(option);
          inputElement.disabled = true;
        }

        formGroup.appendChild(inputElement);
        inputElement.addEventListener('change', () => updateMaxButton(form));
      } else if (methodName === 'transferEscrow' && input.name === '_erc20Contract') {
        inputElement = document.createElement('select');
        inputElement.className = 'select';
        inputElement.id = input.name;
        inputElement.name = input.name;

        for (const token of predefinedTokens) {
          const option = document.createElement('option');
          option.value = token.address;
          option.innerText = token.name;
          inputElement.appendChild(option);
        }

        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.innerText = 'Add Your Own Token';
        inputElement.appendChild(customOption);

        formGroup.appendChild(inputElement);

        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.className = 'input';
        customInput.id = 'custom-erc20-address';
        customInput.name = 'custom-erc20-address';
        customInput.placeholder = '0x...';
        customInput.style.display = 'none';
        formGroup.appendChild(customInput);

        inputElement.addEventListener('change', async (e) => {
          const isCustom = e.target.value === 'custom';
          customInput.style.display = isCustom ? 'block' : 'none';

          // Clear the field when switching tokens
          if (!isCustom) {
            customInput.value = ''; // Clear the custom input field
          }

          await updateMaxButton(form);

          if (!isCustom) {
            await updateSelectedERC20Token(e.target.value);
          }
        });

        customInput.addEventListener('input', debouncedUpdateERC20Token);

        await updateSelectedERC20Token(inputElement.value);
      } else if (input.name === '_transferAmount') {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'input';
        inputElement.id = input.name;
        inputElement.name = input.name;
        formGroup.appendChild(inputElement);
      } else {
        if (input.type.endsWith('[]')) {
          inputElement = document.createElement('textarea');
          inputElement.className = 'textarea';
          inputElement.placeholder = 'Enter comma-separated values';
        } else {
          inputElement = document.createElement('input');
          inputElement.type = 'text';
          inputElement.className = 'input';
          if (input.type.startsWith('address')) {
            inputElement.placeholder = '0x...';
          }
        }

        inputElement.id = input.name;
        inputElement.name = input.name;
        formGroup.appendChild(inputElement);
      }

      form.appendChild(formGroup);
    }

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'button submit-button';
    submitButton.innerText = 'Submit';
    form.appendChild(submitButton);

    formContainer.appendChild(form);
    methodFormsContainer.appendChild(formContainer);

    form.addEventListener('change', () => updateMaxButton(form));
    updateMaxButton(form);
  }

  generateExtraTools(facetMethods, extraMethodNames);
}
// Function to Generate Method Forms
async function generateMethodForms() {
  methodFormsContainer.innerHTML = '';
  if (!contract) {
    methodFormsContainer.innerHTML = '<p>Please connect your wallet to interact with the contract.</p>';
    return;
  }

  const selectedFacet = 'EscrowFacet';
  const facetMethods = getFacetMethods(selectedFacet);

  if (!facetMethods) {
    methodFormsContainer.innerHTML = '<p>No methods found for the selected facet.</p>';
    return;
  }

  const mainMethodNames = ['transferEscrow'];
  const extraMethodNames = ['batchTransferEscrow', 'batchDepositERC20', 'batchDepositGHST', 'depositERC20'];

  for (const methodName of mainMethodNames) {
    const method = facetMethods[methodName];
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const formHeader = document.createElement('div');
    formHeader.className = 'form-header';

    const formTitle = document.createElement('h3');
    formTitle.innerText = 'Withdraw (TransferEscrow)';
    formHeader.appendChild(formTitle);
    formContainer.appendChild(formHeader);

    const form = document.createElement('form');
    form.setAttribute('data-method', methodName);
    form.addEventListener('submit', handleFormSubmit);

    for (const input of method.inputs) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', input.name);

      if (methodName === 'transferEscrow') {
        if (input.name === '_tokenId') {
          label.innerText = 'Select Aavegotchi:';
        } else if (input.name === '_erc20Contract') {
          label.innerText = 'ERC20 Contract Address:';
        } else if (input.name === '_transferAmount') {
          label.innerText = 'Withdraw Amount:';

          const maxButton = document.createElement('button');
          maxButton.type = 'button';
          maxButton.className = 'max-button';
          maxButton.innerText = 'Max';
          maxButton.addEventListener('click', async () => {
            await handleMaxButtonClick(form);
          });
          label.appendChild(maxButton);
        } else {
          label.innerText = `${input.name} (${input.type}):`;
        }
      } else {
        label.innerText = `${input.name} (${input.type}):`;
      }

      formGroup.appendChild(label);

      let inputElement;
      if (input.name === '_tokenId') {
        inputElement = document.createElement('select');
        inputElement.className = 'select';
        inputElement.id = input.name;
        inputElement.name = input.name;

        if (ownedAavegotchis.length > 1) {
          const allOption = document.createElement('option');
          allOption.value = 'all';
          allOption.innerText = 'All Owned Aavegotchis';
          inputElement.appendChild(allOption);
        }

        for (const aavegotchi of ownedAavegotchis) {
          const option = document.createElement('option');
          option.value = aavegotchi.tokenId.toString();
          const name = aavegotchi.name && aavegotchi.name.trim() !== '' ? aavegotchi.name : '(No Name)';
          option.innerText = `Aavegotchi ID ${aavegotchi.tokenId} (${name})`;
          inputElement.appendChild(option);
        }

        if (ownedAavegotchis.length === 0) {
          const option = document.createElement('option');
          option.value = '';
          option.innerText = 'No owned Aavegotchis available';
          inputElement.appendChild(option);
          inputElement.disabled = true;
        }

        formGroup.appendChild(inputElement);
        inputElement.addEventListener('change', () => updateMaxButton(form));
      } else if (methodName === 'transferEscrow' && input.name === '_erc20Contract') {
        inputElement = document.createElement('select');
        inputElement.className = 'select';
        inputElement.id = input.name;
        inputElement.name = input.name;

        for (const token of predefinedTokens) {
          const option = document.createElement('option');
          option.value = token.address;
          option.innerText = token.name;
          inputElement.appendChild(option);
        }

        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.innerText = 'Add Your Own Token';
        inputElement.appendChild(customOption);

        formGroup.appendChild(inputElement);

        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.className = 'input';
        customInput.id = 'custom-erc20-address';
        customInput.name = 'custom-erc20-address';
        customInput.placeholder = '0x...';
        customInput.style.display = 'none';
        formGroup.appendChild(customInput);

        inputElement.addEventListener('change', async (e) => {
          const isCustom = e.target.value === 'custom';
          customInput.style.display = isCustom ? 'block' : 'none';

          // Clear the field when switching tokens
          if (!isCustom) {
            customInput.value = ''; // Clear the custom input field
          }

          await updateMaxButton(form);

          if (!isCustom) {
            await updateSelectedERC20Token(e.target.value);
          }
        });

        customInput.addEventListener('input', debouncedUpdateERC20Token);

        await updateSelectedERC20Token(inputElement.value);
      } else if (input.name === '_transferAmount') {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'input';
        inputElement.id = input.name;
        inputElement.name = input.name;
        formGroup.appendChild(inputElement);
      } else {
        if (input.type.endsWith('[]')) {
          inputElement = document.createElement('textarea');
          inputElement.className = 'textarea';
          inputElement.placeholder = 'Enter comma-separated values';
        } else {
          inputElement = document.createElement('input');
          inputElement.type = 'text';
          inputElement.className = 'input';
          if (input.type.startsWith('address')) {
            inputElement.placeholder = '0x...';
          }
        }

        inputElement.id = input.name;
        inputElement.name = input.name;
        formGroup.appendChild(inputElement);
      }

      form.appendChild(formGroup);
    }

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'button submit-button';
    submitButton.innerText = 'Submit';
    form.appendChild(submitButton);

    formContainer.appendChild(form);
    methodFormsContainer.appendChild(formContainer);

    form.addEventListener('change', () => updateMaxButton(form));
    updateMaxButton(form);
  }

  generateExtraTools(facetMethods, extraMethodNames);
}
// Function to Generate Extra Tools
function generateExtraTools(facetMethods, extraMethodNames) {
  if (extraMethodNames.length > 0) {
    const extraToolsContainer = document.createElement('div');
    extraToolsContainer.className = 'form-container';

    const extraToolsHeader = document.createElement('div');
    extraToolsHeader.className = 'form-header';
    extraToolsHeader.style.cursor = 'pointer';

    const extraToolsTitle = document.createElement('h3');
    extraToolsTitle.innerText = 'Extra Tools';
    extraToolsHeader.appendChild(extraToolsTitle);

    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'toggle-icon collapsed';
    toggleIcon.innerHTML = '&#9660;';
    extraToolsHeader.appendChild(toggleIcon);

    extraToolsContainer.appendChild(extraToolsHeader);

    const collapsibleContent = document.createElement('div');
    collapsibleContent.className = 'collapsible-content';

    extraMethodNames.forEach((methodName) => {
      const method = facetMethods[methodName];
      const formContainer = document.createElement('div');
      formContainer.className = 'form-container-inner';

      const formHeader = document.createElement('div');
      formHeader.className = 'form-header';

      const formTitle = document.createElement('h3');
      formTitle.innerText = methodName;
      formHeader.appendChild(formTitle);

      const formToggleIcon = document.createElement('span');
      formToggleIcon.className = 'toggle-icon collapsed';
      formToggleIcon.innerHTML = '&#9660;';
      formHeader.appendChild(formToggleIcon);

      formContainer.appendChild(formHeader);

      const formCollapsibleContent = document.createElement('div');
      formCollapsibleContent.className = 'collapsible-content';

      const form = document.createElement('form');
      form.setAttribute('data-method', methodName);
      form.addEventListener('submit', handleFormSubmit);

      for (const input of method.inputs) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', input.name);
        label.innerText = `${input.name} (${input.type}):`;

        formGroup.appendChild(label);

        let inputElement;
        if (input.type.endsWith('[]')) {
          inputElement = document.createElement('textarea');
          inputElement.className = 'textarea';
          inputElement.placeholder = 'Enter comma-separated values';
        } else {
          inputElement = document.createElement('input');
          inputElement.type = 'text';
          inputElement.className = 'input';
          if (input.type.startsWith('address')) {
            inputElement.placeholder = '0x...';
          }
        }

        inputElement.id = input.name;
        inputElement.name = input.name;
        formGroup.appendChild(inputElement);
        form.appendChild(formGroup);
      }

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.className = 'button submit-button';
      submitButton.innerText = 'Submit';
      form.appendChild(submitButton);

      formCollapsibleContent.appendChild(form);
      formContainer.appendChild(formCollapsibleContent);
      collapsibleContent.appendChild(formContainer);

      toggleCollapse(formCollapsibleContent, formToggleIcon, false);

      formHeader.addEventListener('click', () => {
        const isExpanded = formCollapsibleContent.classList.contains('expanded');
        toggleCollapse(formCollapsibleContent, formToggleIcon, !isExpanded);
      });
    });

    extraToolsContainer.appendChild(collapsibleContent);
    methodFormsContainer.appendChild(extraToolsContainer);
    toggleCollapse(collapsibleContent, toggleIcon, false);

    extraToolsHeader.addEventListener('click', () => {
      const isExpanded = collapsibleContent.classList.contains('expanded');
      toggleCollapse(collapsibleContent, toggleIcon, !isExpanded);
    });
  }
}

// Function to Get Methods for a Facet
function getFacetMethods(facet) {
  const facets = {
    EscrowFacet: {
      transferEscrow: {
        inputs: [
          { name: '_tokenId', type: 'uint256' },
          { name: '_erc20Contract', type: 'address' },
          { name: '_transferAmount', type: 'uint256' },
        ],
      },
      batchTransferEscrow: {
        inputs: [
          { name: '_tokenIds', type: 'uint256[]' },
          { name: '_erc20Contracts', type: 'address[]' },
          { name: '_recipients', type: 'address[]' },
          { name: '_transferAmounts', type: 'uint256[]' },
        ],
      },
      batchDepositERC20: {
        inputs: [
          { name: '_tokenIds', type: 'uint256[]' },
          { name: '_erc20Contracts', type: 'address[]' },
          { name: '_values', type: 'uint256[]' },
        ],
      },
      batchDepositGHST: {
        inputs: [
          { name: '_tokenIds', type: 'uint256[]' },
          { name: '_values', type: 'uint256[]' },
        ],
      },
      depositERC20: {
        inputs: [
          { name: '_tokenId', type: 'uint256' },
          { name: '_erc20Contract', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
      },
    },
  };

  return facets[facet];
}
// Function to Toggle Collapse
function toggleCollapse(contentElement, iconElement, expand) {
  if (expand) {
    contentElement.classList.add('expanded');
    iconElement.classList.remove('collapsed');
    iconElement.classList.add('expanded');
    iconElement.innerHTML = '&#9650;';
  } else {
    contentElement.classList.remove('expanded');
    iconElement.classList.remove('expanded');
    iconElement.classList.add('collapsed');
    iconElement.innerHTML = '&#9660;';
  }
}

// Function to Handle Form Submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const methodName = form.getAttribute('data-method');
  const methodInputs = getMethodInputs(methodName);

  if (!methodInputs) {
    showToast('Invalid method.', 'error');
    return;
  }

  const args = [];
  for (const input of methodInputs) {
    const inputElement = form.querySelector(`[name="${input.name}"]`);
    if (!inputElement) {
      showToast(`Missing input: ${input.name}`, 'error');
      return;
    }

    let value = inputElement.value.trim();

    if (input.type.endsWith('[]')) {
      value = value.split(',').map((v) => v.trim());
    }

    if (input.type.startsWith('uint') || input.type.startsWith('int')) {
      if (Array.isArray(value)) {
        value = value.map((v) => BigInt(v));
      } else {
        value = BigInt(value);
      }
    }

    args.push(value);
  }

  try {
    const tx = await contract[methodName](...args);
    showToast('Transaction sent. Waiting for confirmation...', 'success');
    await tx.wait();
    showToast('Transaction confirmed!', 'success');
  } catch (error) {
    console.error('Transaction error:', error);
    showToast('Transaction failed. See console for details.', 'error');
  }
}

// Function to Get Method Inputs
function getMethodInputs(methodName) {
  const methods = getFacetMethods('EscrowFacet');
  if (methods && methods[methodName]) {
    return methods[methodName].inputs;
  }
  return null;
}

// Function to Update Max Button
async function updateMaxButton(form) {
  const tokenIdSelect = form.querySelector('select[name="_tokenId"]');
  const erc20ContractSelect = form.querySelector('select[name="_erc20Contract"]');
  const customErc20Input = form.querySelector('input[name="custom-erc20-address"]');

  const tokenIdValue = tokenIdSelect ? tokenIdSelect.value : null;
  let erc20Address = erc20ContractSelect ? erc20ContractSelect.value : null;

  if (erc20Address === 'custom') {
    erc20Address = customErc20Input ? customErc20Input.value : null;
  }

  if (!erc20Address || !ethers.isAddress(erc20Address)) {
    return;
  }

  const amountInput = form.querySelector('input[name="_transferAmount"]');
  const maxButton = form.querySelector('.max-button');

  if (!tokenIdValue || !amountInput || !maxButton) return;

  maxButton.disabled = true;
  maxButton.innerText = 'Loading...';

  try {
    let totalBalance = 0n;
    const tokenContract = new ethers.Contract(erc20Address, ghstABI, provider);

    if (tokenIdValue === 'all') {
      const balancePromises = ownedAavegotchis.map(async (gotchi) => {
        const escrowWallet = gotchi.escrow;
        const balance = await tokenContract.balanceOf(escrowWallet);
        return balance;
      });

      const balances = await Promise.all(balancePromises);

      const filteredBalances = balances.filter((balance) => balance > 0n);

      if (filteredBalances.length === 0) {
        maxButton.disabled = true;
        maxButton.innerText = 'Max';
        showToast('None of your Aavegotchis hold the selected token.', 'error');
        return;
      }

      for (const balance of filteredBalances) {
        totalBalance += balance;
      }

      maxButton.dataset.maxValue = totalBalance.toString();
    } else {
      const gotchi = ownedAavegotchis.find((g) => g.tokenId.toString() === tokenIdValue);
      if (!gotchi) throw new Error('Selected Aavegotchi not found.');
      const escrowWallet = gotchi.escrow;
      totalBalance = await tokenContract.balanceOf(escrowWallet);
      maxButton.dataset.maxValue = totalBalance.toString();
    }

    maxButton.disabled = false;
    maxButton.innerText = 'Max';
  } catch (error) {
    console.error('Error fetching token balance:', error);
    showToast('Error fetching token balance.', 'error');
    maxButton.disabled = true;
    maxButton.innerText = 'Max';
  }
}

// Function to Handle Max Button Click
async function handleMaxButtonClick(form) {
  const amountInput = form.querySelector('input[name="_transferAmount"]');
  const maxButton = form.querySelector('.max-button');
  const maxValue = maxButton.dataset.maxValue;

  if (maxValue) {
    const tokenIdSelect = form.querySelector('select[name="_tokenId"]');
    const erc20ContractSelect = form.querySelector('select[name="_erc20Contract"]');
    const customErc20Input = form.querySelector('input[name="custom-erc20-address"]');
    let erc20Address = erc20ContractSelect ? erc20ContractSelect.value : null;

    if (erc20Address === 'custom') {
      erc20Address = customErc20Input ? customErc20Input.value : null;
    }

    const tokenContract = new ethers.Contract(erc20Address, ghstABI, provider);
    const decimals = await tokenContract.decimals();

    const formattedValue = ethers.formatUnits(maxValue, decimals);
    amountInput.value = formattedValue;
  }
}
// Function to Refresh Table Balances Based on Selected ERC20 Token
async function refreshTableBalances() {
  try {
    const rows = document.querySelectorAll('.aavegotchi-table tbody tr');

    if (!selectedERC20Address || !ethers.isAddress(selectedERC20Address)) {
      // If no valid ERC20 address is selected, clear the balances
      rows.forEach((row) => {
        const balanceCell = row.querySelector('td:nth-child(4)');
        balanceCell.innerText = 'N/A';
      });
      return;
    }

    const tokenContract = new ethers.Contract(selectedERC20Address, ghstABI, provider);

    const balancePromises = Array.from(rows).map((row) => {
      const escrowWallet = row.querySelector('td:nth-child(3) a').getAttribute('title');
      return tokenContract.balanceOf(escrowWallet);
    });

    const balances = await Promise.all(balancePromises);

    const imageUrl = await getTokenImageUrl(selectedERC20Address);

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const balanceCell = row.querySelector('td:nth-child(4)');
      const formattedBalance = ethers.formatUnits(balances[index], selectedERC20Decimals);

      const tokenImage = document.createElement('img');
      tokenImage.src = imageUrl;
      tokenImage.alt = selectedERC20Symbol;
      tokenImage.width = 24;
      tokenImage.height = 24;
      tokenImage.onerror = function () {
        this.onerror = null;
        this.src = 'path/to/default/token/image.png'; // Use a default image path
      };

      const tokenBalanceWrapper = document.createElement('div');
      tokenBalanceWrapper.className = 'token-balance';
      tokenBalanceWrapper.appendChild(tokenImage);
      tokenBalanceWrapper.appendChild(document.createTextNode(formattedBalance));

      balanceCell.innerHTML = '';
      balanceCell.appendChild(tokenBalanceWrapper);
    }
  } catch (error) {
    console.error('Error refreshing table balances:', error);
    showToast('Failed to refresh token balances.', 'error');
  }
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced version of the updateSelectedERC20Token function
const debouncedUpdateERC20Token = debounce(async (address) => {
  if (address === '' || address.length < 42) {
    // Reset to default GHST token
    selectedERC20Address = ghstContractAddress;
    selectedERC20Symbol = 'GHST';
    selectedERC20Decimals = 18;
  } else {
    const formattedAddress = validateAndFormatERC20Address(address);
    if (formattedAddress) {
      try {
        await updateSelectedERC20Token(formattedAddress);
      } catch (error) {
        console.error('Error updating ERC20 token:', error);
        showToast('Invalid ERC20 token address.', 'error');
      }
    } else {
      showToast('Invalid ERC20 address format.', 'error');
    }
  }

  // Update table header
  const tableHeader = document.querySelector('.aavegotchi-table th:nth-child(4)');
  if (tableHeader) {
    tableHeader.innerText = `${selectedERC20Symbol} Balance`;
  }

  // Refresh table balances
  await refreshTableBalances();
}, 500); // 500ms debounce time

// Update the event listener for custom ERC20 address input
document.addEventListener('input', (event) => {
  if (event.target.id === 'custom-erc20-address') {
    const customAddress = event.target.value.trim();
    debouncedUpdateERC20Token(customAddress);
  }
});

// Function to validate and format ERC20 address input
function validateAndFormatERC20Address(input) {
  const address = input.trim();
  if (ethers.isAddress(address)) {
    return ethers.getAddress(address); // This returns the checksum address
  }
  return null;
}
// Function to Get Token Image URL
async function getTokenImageUrl(tokenAddress) {
  // Implement your logic to fetch the token image URL
  // For now, return a placeholder image
  return 'path/to/token/image.png';
}

// Initial call to generate method forms if the wallet is already connected
window.onload = async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
};

// Function to Initialize Copy Button Event Listeners
function initializeCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const addressToCopy = button.getAttribute('data-copy-target');
      if (!addressToCopy) return;

      navigator.clipboard
        .writeText(addressToCopy)
        .then(() => {
          button.innerText = '✅';
          setTimeout(() => {
            button.innerText = '📄';
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy!', err);
          showToast('Failed to copy the address. Please try again.', 'error');
        });
    });
  });
}
// Obfuscated API Key (placeholder used)
const POLYGONSCAN_API_KEY = 'YOUR_POLYGONSCAN_API_KEY';

// Function to fetch rarity farming deposits
async function fetchRarityFarmingDeposits(escrowAddress) {
  const GHST_CONTRACT = ghstContractAddress; // GHST token on Polygon
  const currentTime = Math.floor(Date.now() / 1000);
  const oneYearAgo = currentTime - 365 * 24 * 60 * 60;
  const url = `https://api.polygonscan.com/api?module=account&action=tokentx&address=${escrowAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${POLYGONSCAN_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '0' && data.message === 'No transactions found') {
      console.log(`No transactions found for address: ${escrowAddress}`);
      return [];
    }

    if (data.status !== '1') {
      throw new Error(`API request failed: ${data.message}`);
    }

    const deposits = data.result.filter(
      (tx) =>
        tx.to.toLowerCase() === escrowAddress.toLowerCase() &&
        tx.contractAddress.toLowerCase() === GHST_CONTRACT.toLowerCase() &&
        parseInt(tx.timeStamp) >= oneYearAgo
    );

    return deposits.map((tx) => ({
      hash: tx.hash,
      value: ethers.formatUnits(tx.value, 18),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(), // Include time
    }));
  } catch (error) {
    console.error('Error fetching rarity farming deposits:', error);
    return [];
  }
}

// Function to fetch all rarity farming deposits
async function fetchAllRarityFarmingDeposits(escrowAddress) {
  const GHST_CONTRACT = ghstContractAddress; // GHST token on Polygon
  const url = `https://api.polygonscan.com/api?module=account&action=tokentx&address=${escrowAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${POLYGONSCAN_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '0' && data.message === 'No transactions found') {
      console.log(`No transactions found for address: ${escrowAddress}`);
      return [];
    }

    if (data.status !== '1') {
      throw new Error(`API request failed: ${data.message}`);
    }

    const deposits = data.result.filter(
      (tx) =>
        tx.to.toLowerCase() === escrowAddress.toLowerCase() &&
        tx.contractAddress.toLowerCase() === GHST_CONTRACT.toLowerCase()
    );

    return deposits.map((tx) => ({
      hash: tx.hash,
      value: ethers.formatUnits(tx.value, 18),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(), // Include time
    }));
  } catch (error) {
    console.error('Error fetching all rarity farming deposits:', error);
    return [];
  }
}

// Note: Replace 'YOUR_POLYGONSCAN_API_KEY' with your actual Polygonscan API key.
console.log('app.js loaded');
