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

// Event Listeners
connectWalletButton.addEventListener('click', connectWallet);

// Function to Connect Wallet
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install MetaMask to use this DApp.');
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    userAddress = address;

    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    walletInfo.innerHTML = 
      `<p>Connected Wallet Address: 
        <a href="https://polygonscan.com/address/${address}" target="_blank" rel="noopener noreferrer" class="address-link" title="${address}">
          ${shortAddress}
        </a>
      </p>
      `;
  
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
      alert('Please switch to the Polygon network in MetaMask.');
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
          alert('The Polygon network is not available in your MetaMask. Please add it manually.');
        } else {
          alert('Failed to switch to the Polygon network. Please switch manually in MetaMask.');
        }
        return;
      }
    }

    contract = new ethers.Contract(contractAddress, combinedABI, signer);
    ghstContract = new ethers.Contract(ghstContractAddress, ghstABI, provider);

    connectWalletButton.innerText = `Connected: ${shortAddress}`;

    await fetchAndDisplayAavegotchis(address);
    generateMethodForms(); // Generate forms after fetching Aavegotchis

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    initializeCopyButtons();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    alert('Failed to connect wallet. See console for details.');
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

// Function to Generate Method Forms (Tab-Based)
function generateMethodForms() {
  methodFormsContainer.innerHTML = '';
  if (!contract) {
    methodFormsContainer.innerHTML = '<p>Please connect your wallet to interact with the contract.</p>';
    return;
  }

  // The forms are already defined in the HTML via tabs, so no need to generate them here
  // However, we need to initialize the forms based on the active tab

  // Initialize forms for each tab
  initializeProportionalForm();
  initializeEqualForm();
  initializeUserSpecifiedForm();
}

// Function to Initialize Proportional Form
function initializeProportionalForm() {
  const proportionalForm = document.getElementById('proportional-form');
  const proportionalBreakdown = document.getElementById('proportional-breakdown');
  const proportionalAmountInput = document.getElementById('proportional-amount');
  const proportionalMaxButton = proportionalForm.querySelector('.max-button');

  proportionalForm.addEventListener('submit', handleProportionalWithdraw);
  proportionalMaxButton.addEventListener('click', () => handleMaxButtonClick(proportionalForm, 'proportional'));

  proportionalAmountInput.addEventListener('input', () => updateProportionalBreakdown(proportionalForm, proportionalBreakdown));
}

// Function to Initialize Equal Form
function initializeEqualForm() {
  const equalForm = document.getElementById('equal-form');
  const equalBreakdown = document.getElementById('equal-breakdown');
  const equalAmountInput = document.getElementById('equal-amount');
  const equalMaxButton = equalForm.querySelector('.max-button');

  equalForm.addEventListener('submit', handleEqualWithdraw);
  equalMaxButton.addEventListener('click', () => handleMaxButtonClick(equalForm, 'equal'));

  equalAmountInput.addEventListener('input', () => updateEqualBreakdown(equalForm, equalBreakdown));
}

// Function to Initialize User-Specified Form
function initializeUserSpecifiedForm() {
  const userForm = document.getElementById('user-specified-form');
  const userTotalAmountInput = document.getElementById('user-total-amount');
  const userMaxButton = userForm.querySelector('.max-button');
  const userAllocationContainer = document.getElementById('user-allocation');
  const userValidationMessage = document.getElementById('user-validation');

  // Dynamically generate allocation fields based on owned Aavegotchis
  ownedAavegotchis.forEach((gotchi) => {
    const allocationItem = document.createElement('div');
    allocationItem.className = 'allocation-item';

    const label = document.createElement('span');
    label.innerText = `${gotchi.name} (ID: ${gotchi.tokenId}):`;
    allocationItem.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.name = `allocation-${gotchi.tokenId}`;
    input.className = 'input';
    input.placeholder = 'Enter GHST';
    input.addEventListener('input', validateUserSpecifiedForm);
    allocationItem.appendChild(input);

    userAllocationContainer.appendChild(allocationItem);
  });

  userForm.addEventListener('submit', handleUserSpecifiedWithdraw);
  userMaxButton.addEventListener('click', () => handleMaxButtonClick(userForm, 'user-specified'));
  userTotalAmountInput.addEventListener('input', validateUserSpecifiedForm);
}

// Function to Validate User-Specified Form
function validateUserSpecifiedForm() {
  const userForm = document.getElementById('user-specified-form');
  const userTotalAmountInput = document.getElementById('user-total-amount');
  const userAllocationInputs = userForm.querySelectorAll('input[name^="allocation-"]');
  const userValidationMessage = document.getElementById('user-validation');

  let totalDesired = 0;
  let totalAllocated = 0;
  let valid = true;

  // Parse total desired amount
  if (userTotalAmountInput.value.trim() !== '') {
    if (!/^\d+(\.\d+)?$/.test(userTotalAmountInput.value.trim())) {
      valid = false;
      userValidationMessage.innerText = 'Invalid number for total withdrawal amount.';
      return;
    }
    totalDesired = parseFloat(userTotalAmountInput.value.trim());
  }

  // Parse allocated amounts
  userAllocationInputs.forEach((input) => {
    if (input.value.trim() !== '') {
      if (!/^\d+(\.\d+)?$/.test(input.value.trim())) {
        valid = false;
        userValidationMessage.innerText = 'Invalid number in one of the allocations.';
        return;
      }
      totalAllocated += parseFloat(input.value.trim());
    }
  });

  if (valid) {
    if (totalDesired === 0) {
      userValidationMessage.innerText = '';
      return;
    }
    if (totalAllocated !== totalDesired) {
      valid = false;
      userValidationMessage.innerText = `Total allocated (${totalAllocated} GHST) does not match desired amount (${totalDesired} GHST).`;
    } else {
      userValidationMessage.innerText = '';
    }
  }
}

// Function to Handle Proportional Withdraw
async function handleProportionalWithdraw(event) {
  event.preventDefault();
  const form = event.target;
  const amountInput = form.querySelector('#proportional-amount');
  const breakdownContainer = document.getElementById('proportional-breakdown');
  const submitButton = form.querySelector('.submit-button');

  let transferAmountValue = amountInput.value.trim();

  if (transferAmountValue === '') {
    alert('Please enter an amount or click Max.');
    return;
  }

  if (!/^\d+(\.\d+)?$/.test(transferAmountValue)) {
    alert('Invalid number for amount');
    return;
  }

  try {
    const tokenContract = new ethers.Contract(predefinedTokens[0].address, ghstABI, provider);
    const decimals = await tokenContract.decimals();
    const totalTransferAmount = ethers.parseUnits(transferAmountValue, decimals);
    const totalAvailableBalance = ownedAavegotchis.reduce((acc, gotchi) => acc + BigInt(gotchi.ghstBalance), 0n);

    if (totalTransferAmount > totalAvailableBalance) {
      alert('The total amount exceeds the total available balance across your Aavegotchis.');
      return;
    }

    // Calculate proportional amounts
    const transferAmounts = ownedAavegotchis.map((gotchi) => {
      const balance = BigInt(gotchi.ghstBalance);
      return balance === 0n ? 0n : (balance * totalTransferAmount) / totalAvailableBalance;
    });

    const _tokenIds = ownedAavegotchis.map((gotchi) => BigInt(gotchi.tokenId));
    const _erc20Contracts = ownedAavegotchis.map(() => predefinedTokens[0].address);
    const _recipients = ownedAavegotchis.map(() => userAddress);
    const _transferAmounts = transferAmounts;

    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    const tx = await contract.batchTransferEscrow(_tokenIds, _erc20Contracts, _recipients, _transferAmounts);
    alert(`Transaction submitted. Hash: ${tx.hash}`);
    await tx.wait();
    alert('Transaction confirmed!');
    
    // Refresh Aavegotchi data after withdrawal
    await fetchAndDisplayAavegotchis(userAddress);
    generateMethodForms();
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.info?.error?.message || error.message}`);
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = 'Withdraw Proportionally';
  }
}

// Function to Handle Equal Withdraw
async function handleEqualWithdraw(event) {
  event.preventDefault();
  const form = event.target;
  const amountInput = form.querySelector('#equal-amount');
  const breakdownContainer = document.getElementById('equal-breakdown');
  const submitButton = form.querySelector('.submit-button');

  let transferAmountValue = amountInput.value.trim();

  if (transferAmountValue === '') {
    alert('Please enter an amount or click Max.');
    return;
  }

  if (!/^\d+(\.\d+)?$/.test(transferAmountValue)) {
    alert('Invalid number for amount');
    return;
  }

  try {
    const tokenContract = new ethers.Contract(predefinedTokens[0].address, ghstABI, provider);
    const decimals = await tokenContract.decimals();
    const totalTransferAmount = ethers.parseUnits(transferAmountValue, decimals);
    const totalAvailableBalance = ownedAavegotchis.reduce((acc, gotchi) => acc + BigInt(gotchi.ghstBalance), 0n);
    const numberOfGotchis = ownedAavegotchis.length;

    if (totalTransferAmount > totalAvailableBalance) {
      alert('The total amount exceeds the total available balance across your Aavegotchis.');
      return;
    }

    // Calculate equal amounts
    const equalAmount = totalTransferAmount / BigInt(numberOfGotchis);
    const remainder = totalTransferAmount % BigInt(numberOfGotchis);

    const transferAmounts = ownedAavegotchis.map((gotchi, index) => {
      let amount = equalAmount;
      if (index < Number(remainder)) {
        amount += 1n; // Distribute the remainder
      }
      return amount;
    });

    const _tokenIds = ownedAavegotchis.map((gotchi) => BigInt(gotchi.tokenId));
    const _erc20Contracts = ownedAavegotchis.map(() => predefinedTokens[0].address);
    const _recipients = ownedAavegotchis.map(() => userAddress);
    const _transferAmounts = transferAmounts;

    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    const tx = await contract.batchTransferEscrow(_tokenIds, _erc20Contracts, _recipients, _transferAmounts);
    alert(`Transaction submitted. Hash: ${tx.hash}`);
    await tx.wait();
    alert('Transaction confirmed!');
    
    // Refresh Aavegotchi data after withdrawal
    await fetchAndDisplayAavegotchis(userAddress);
    generateMethodForms();
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.info?.error?.message || error.message}`);
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = 'Withdraw Equally';
  }
}

// Function to Handle User-Specified Withdraw
async function handleUserSpecifiedWithdraw(event) {
  event.preventDefault();
  const form = event.target;
  const totalAmountInput = form.querySelector('#user-total-amount');
  const allocationInputs = form.querySelectorAll('input[name^="allocation-"]');
  const validationMessage = document.getElementById('user-validation');
  const submitButton = form.querySelector('.submit-button');

  let totalDesired = parseFloat(totalAmountInput.value.trim());
  let totalAllocated = 0;
  let allocations = [];

  if (isNaN(totalDesired) || totalDesired <= 0) {
    alert('Please enter a valid total withdrawal amount.');
    return;
  }

  allocationInputs.forEach((input) => {
    const value = parseFloat(input.value.trim());
    if (isNaN(value) || value < 0) {
      alert('Please enter valid numbers for all allocations.');
      return;
    }
    allocations.push(value);
    totalAllocated += value;
  });

  if (totalAllocated !== totalDesired) {
    alert(`Total allocated (${totalAllocated} GHST) does not match desired amount (${totalDesired} GHST).`);
    return;
  }

  try {
    const tokenContract = new ethers.Contract(predefinedTokens[0].address, ghstABI, provider);
    const decimals = await tokenContract.decimals();
    const totalTransferAmount = ethers.parseUnits(totalAmountInput.value.trim(), decimals);
    const totalAvailableBalance = ownedAavegotchis.reduce((acc, gotchi) => acc + BigInt(gotchi.ghstBalance), 0n);

    if (totalTransferAmount > totalAvailableBalance) {
      alert('The total amount exceeds the total available balance across your Aavegotchis.');
      return;
    }

    // Convert allocations to BigInt in smallest unit
    const transferAmounts = allocations.map((amount) => ethers.parseUnits(amount.toString(), decimals).toBigInt());

    const _tokenIds = ownedAavegotchis.map((gotchi) => BigInt(gotchi.tokenId));
    const _erc20Contracts = ownedAavegotchis.map(() => predefinedTokens[0].address);
    const _recipients = ownedAavegotchis.map(() => userAddress);
    const _transferAmounts = transferAmounts;

    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    const tx = await contract.batchTransferEscrow(_tokenIds, _erc20Contracts, _recipients, _transferAmounts);
    alert(`Transaction submitted. Hash: ${tx.hash}`);
    await tx.wait();
    alert('Transaction confirmed!');
    
    // Refresh Aavegotchi data after withdrawal
    await fetchAndDisplayAavegotchis(userAddress);
    generateMethodForms();
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.info?.error?.message || error.message}`);
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = 'Withdraw as Specified';
  }
}

// Function to Toggle Collapse (Unused in Tab-Based UI but kept for consistency)
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

// Function to Fetch and Display Aavegotchis
async function fetchAndDisplayAavegotchis(ownerAddress) {
  try {
    const aavegotchis = await contract.allAavegotchisOfOwner(ownerAddress);

    if (aavegotchis.length === 0) {
      aavegotchiInfoContainer.innerHTML = '<p>No Aavegotchis found for this wallet.</p>';
      return;
    }

    const ghstDecimals = await ghstContract.decimals();
    const ghstSymbol = await ghstContract.symbol();

    const table = document.createElement('table');
    table.className = 'aavegotchi-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Token ID', 'Name', 'Escrow Wallet', 'GHST Balance', 'Status'];
    headers.forEach((headerText) => {
      const th = document.createElement('th');
      th.innerText = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    // Fetch balances and lending status in parallel
    const balancePromises = [];
    const lendingStatusPromises = [];
    for (const aavegotchi of aavegotchis) {
      balancePromises.push(ghstContract.balanceOf(aavegotchi.escrow));
      lendingStatusPromises.push(contract.isAavegotchiLent(aavegotchi.tokenId));
    }

    const balances = await Promise.all(balancePromises);
    const lendingStatuses = await Promise.all(lendingStatusPromises);

    ownedAavegotchis = []; // Reset owned Aavegotchis

    aavegotchis.forEach((aavegotchi, index) => {
      const isLent = lendingStatuses[index];
      const isOwned = !isLent;

      if (isOwned) {
        ownedAavegotchis.push({
          tokenId: aavegotchi.tokenId.toString(),
          name: aavegotchi.name,
          escrow: aavegotchi.escrow,
          ghstBalance: balances[index].toString(),
        });
      }

      const row = document.createElement('tr');

      const tokenId = aavegotchi.tokenId.toString();
      const name = aavegotchi.name;
      const escrowWallet = aavegotchi.escrow;
      const shortEscrowWallet = `${escrowWallet.slice(0, 6)}...${escrowWallet.slice(-4)}`;

      // Store escrow balances
      escrowBalances[escrowWallet] = {
        ghstBalance: balances[index],
        tokenBalances: {},
      };

      // Token ID Cell
      const tokenIdCell = document.createElement('td');
      tokenIdCell.setAttribute('data-label', 'Token ID');
      tokenIdCell.innerText = tokenId;
      row.appendChild(tokenIdCell);

      // Name Cell
      const nameCell = document.createElement('td');
      nameCell.setAttribute('data-label', 'Name');
      nameCell.innerText = name;
      row.appendChild(nameCell);

      // Escrow Wallet Cell
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

      // Add copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.setAttribute('data-copy-target', escrowWallet);
      copyButton.setAttribute('aria-label', 'Copy Escrow Wallet Address');
      copyButton.setAttribute('data-tooltip', 'Click to copy');
      copyButton.innerText = '📄';
      escrowCell.appendChild(copyButton);

      row.appendChild(escrowCell);

      // GHST Balance Cell
      const ghstBalanceRaw = balances[index];
      const ghstBalance = ethers.formatUnits(ghstBalanceRaw, ghstDecimals);
      const ghstBalanceCell = document.createElement('td');
      ghstBalanceCell.setAttribute('data-label', 'GHST Balance');
      ghstBalanceCell.innerText = ghstBalance;
      row.appendChild(ghstBalanceCell);

      // Status Cell
      const statusCell = document.createElement('td');
      statusCell.setAttribute('data-label', 'Status');
      if (isOwned) {
        statusCell.innerText = 'Owned';
        statusCell.className = 'status-owned';
      } else {
        statusCell.innerText = 'Rented';
        statusCell.className = 'status-rented';
      }
      row.appendChild(statusCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    aavegotchiInfoContainer.innerHTML = '<h2>Your Aavegotchis:</h2>';
    aavegotchiInfoContainer.appendChild(table);

    initializeCopyButtons();

    // After fetching Aavegotchis, regenerate user-specified allocation form
    generateMethodForms();
  } catch (error) {
    console.error('Error fetching Aavegotchis:', error);
    aavegotchiInfoContainer.innerHTML = '<p>Error fetching Aavegotchis. See console for details.</p>';
  }
}

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
          alert('Failed to copy the address. Please try again.');
        });
    });
  });
}

// Function to Update Proportional Breakdown
async function updateProportionalBreakdown(form, breakdownContainer) {
  const amountInput = form.querySelector('#proportional-amount');
  const amountValue = amountInput.value.trim();

  breakdownContainer.innerHTML = '';

  if (amountValue === '' || !/^\d+(\.\d+)?$/.test(amountValue)) {
    return;
  }

  const totalDesired = parseFloat(amountValue);
  const totalAvailable = ownedAavegotchis.reduce((acc, gotchi) => acc + parseFloat(ethers.formatUnits(gotchi.ghstBalance, await getDecimals())), 0);

  if (totalDesired > totalAvailable) {
    breakdownContainer.innerHTML = '<p style="color: #dc3545;">Desired amount exceeds total available balance.</p>';
    return;
  }

  const breakdownTable = document.createElement('table');
  breakdownTable.className = 'aavegotchi-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Aavegotchi Name', 'Token ID', 'Withdraw Amount'];
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.innerText = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  breakdownTable.appendChild(thead);

  const tbody = document.createElement('tbody');

  ownedAavegotchis.forEach((gotchi) => {
    const balance = parseFloat(ethers.formatUnits(gotchi.ghstBalance, await getDecimals()));
    const withdrawAmount = ((balance / totalAvailable) * totalDesired).toFixed(4);

    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.innerText = gotchi.name;
    row.appendChild(nameCell);

    const tokenIdCell = document.createElement('td');
    tokenIdCell.innerText = gotchi.tokenId;
    row.appendChild(tokenIdCell);

    const amountCell = document.createElement('td');
    amountCell.innerText = `${withdrawAmount} GHST`;
    row.appendChild(amountCell);

    tbody.appendChild(row);
  });

  breakdownTable.appendChild(tbody);
  breakdownContainer.appendChild(breakdownTable);
}

// Function to Update Equal Breakdown
async function updateEqualBreakdown(form, breakdownContainer) {
  const amountInput = form.querySelector('#equal-amount');
  const amountValue = amountInput.value.trim();

  breakdownContainer.innerHTML = '';

  if (amountValue === '' || !/^\d+(\.\d+)?$/.test(amountValue)) {
    return;
  }

  const totalDesired = parseFloat(amountValue);
  const totalAvailable = ownedAavegotchis.reduce((acc, gotchi) => acc + parseFloat(ethers.formatUnits(gotchi.ghstBalance, await getDecimals())), 0);

  if (totalDesired > totalAvailable) {
    breakdownContainer.innerHTML = '<p style="color: #dc3545;">Desired amount exceeds total available balance.</p>';
    return;
  }

  const numberOfGotchis = ownedAavegotchis.length;
  const equalAmount = (totalDesired / numberOfGotchis).toFixed(4);

  const breakdownTable = document.createElement('table');
  breakdownTable.className = 'aavegotchi-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Aavegotchi Name', 'Token ID', 'Withdraw Amount'];
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.innerText = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  breakdownTable.appendChild(thead);

  const tbody = document.createElement('tbody');

  ownedAavegotchis.forEach((gotchi) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.innerText = gotchi.name;
    row.appendChild(nameCell);

    const tokenIdCell = document.createElement('td');
    tokenIdCell.innerText = gotchi.tokenId;
    row.appendChild(tokenIdCell);

    const amountCell = document.createElement('td');
    amountCell.innerText = `${equalAmount} GHST`;
    row.appendChild(amountCell);

    tbody.appendChild(row);
  });

  breakdownTable.appendChild(tbody);
  breakdownContainer.appendChild(breakdownTable);
}

// Function to Get Decimals (Assuming all tokens have the same decimals)
async function getDecimals() {
  const decimals = await ghstContract.decimals();
  return decimals;
}

// Function to Handle Max Button Click
async function handleMaxButtonClick(form, mode) {
  const tokenContract = new ethers.Contract(predefinedTokens[0].address, ghstABI, provider);
  const decimals = await tokenContract.decimals();
  let maxValue = 0;

  if (mode === 'proportional' || mode === 'equal') {
    maxValue = ownedAavegotchis.reduce((acc, gotchi) => acc + BigInt(gotchi.ghstBalance), 0n);
  } else if (mode === 'user-specified') {
    // For user-specified, set the total to the total available
    maxValue = ownedAavegotchis.reduce((acc, gotchi) => acc + BigInt(gotchi.ghstBalance), 0n);
  }

  const formattedMax = ethers.formatUnits(maxValue, decimals);

  if (mode === 'proportional') {
    const amountInput = form.querySelector('#proportional-amount');
    amountInput.value = formattedMax;
    const breakdownContainer = document.getElementById('proportional-breakdown');
    await updateProportionalBreakdown(form, breakdownContainer);
  } else if (mode === 'equal') {
    const amountInput = form.querySelector('#equal-amount');
    amountInput.value = formattedMax;
    const breakdownContainer = document.getElementById('equal-breakdown');
    await updateEqualBreakdown(form, breakdownContainer);
  } else if (mode === 'user-specified') {
    const totalAmountInput = form.querySelector('#user-total-amount');
    totalAmountInput.value = formattedMax;

    // Automatically distribute equally
    const allocationInputs = form.querySelectorAll('input[name^="allocation-"]');
    const numberOfGotchis = allocationInputs.length;
    const equalAllocation = parseFloat(formattedMax) / numberOfGotchis;

    allocationInputs.forEach((input) => {
      input.value = equalAllocation.toFixed(4);
    });

    const validationMessage = document.getElementById('user-validation');
    validationMessage.innerText = `Total allocated: ${formattedMax} GHST`;
  }
}

// Function to Handle Tab Switching
function handleTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      // Hide all tab contents
      tabContents.forEach((content) => content.classList.add('hidden'));
      
      // Add active class to clicked button
      button.classList.add('active');
      // Show corresponding tab content
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.remove('hidden');
    });
  });
}

// Initialize Tabs on Window Load
window.onload = async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
  handleTabSwitching();
};

// Initial call to generate method forms if the wallet is already connected
// This is now handled within fetchAndDisplayAavegotchis and generateMethodForms
