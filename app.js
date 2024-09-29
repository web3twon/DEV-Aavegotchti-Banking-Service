// app.js

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
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    userAddress = address;

    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    walletInfo.innerHTML = `
      <p>Connected Wallet Address: 
        <a href="https://polygonscan.com/address/${address}" target="_blank" rel="noopener noreferrer" class="address-link" title="${address}">
          ${shortAddress}
        </a>
      </p>
    `;

    const network = await provider.getNetwork();
    let networkName = 'Unknown';
    if (network.chainId === 137) {
      networkName = 'Polygon';
    } else if (network.chainId === 1) {
      networkName = 'Ethereum';
    } else if (network.chainId === 80001) {
      networkName = 'Mumbai';
    } else {
      networkName = capitalizeFirstLetter(network.name);
    }
    networkNameDisplay.innerText = `${networkName}`;

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
  } else {
    window.location.reload();
  }
}

// Handle Network Changes
function handleChainChanged(_chainId) {
  window.location.reload();
}

// Function to Capitalize First Letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to Generate Method Forms
function generateMethodForms() {
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

  mainMethodNames.forEach((methodName) => {
    const method = facetMethods[methodName];
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const formHeader = document.createElement('div');
    formHeader.className = 'form-header';

    const formTitle = document.createElement('h3');
    formTitle.innerText = 'TransferEscrow (Withdraw)';
    formHeader.appendChild(formTitle);
    formContainer.appendChild(formHeader);

    const form = document.createElement('form');
    form.setAttribute('data-method', methodName);
    form.addEventListener('submit', handleFormSubmit);

    // Include _tokenId in the inputs
    method.inputs.forEach((input) => {
      if (methodName === 'transferEscrow' && input.name === '_recipient') {
        return;
      }

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
        } else {
          label.innerText = `${input.name} (${input.type}):`;
        }
      } else {
        label.innerText = `${input.name} (${input.type}):`;
      }

      formGroup.appendChild(label);

      let inputElement;
      if (input.name === '_tokenId') {
        // Create a dropdown for owned Aavegotchis
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

        ownedAavegotchis.forEach((aavegotchi) => {
          const option = document.createElement('option');
          option.value = aavegotchi.tokenId.toString();
          option.innerText = `${aavegotchi.name} (ID: ${aavegotchi.tokenId})`;
          inputElement.appendChild(option);
        });

        if (ownedAavegotchis.length === 0) {
          const option = document.createElement('option');
          option.value = '';
          option.innerText = 'No owned Aavegotchis available';
          inputElement.appendChild(option);
          inputElement.disabled = true;
        }

        formGroup.appendChild(inputElement);

        // Add event listener to update Max button when selection changes
        inputElement.addEventListener('change', () => updateMaxButton(form));
      } else if (methodName === 'transferEscrow' && input.name === '_erc20Contract') {
        inputElement = document.createElement('select');
        inputElement.className = 'select';
        inputElement.id = input.name;
        inputElement.name = input.name;

        predefinedTokens.forEach((token) => {
          const option = document.createElement('option');
          option.value = token.address;
          option.innerText = token.name;
          inputElement.appendChild(option);
        });

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
          customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
          await updateMaxButton(form);
        });
      } else if (input.name === '_transferAmount') {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'input';
        inputElement.id = input.name;
        inputElement.name = input.name;

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'input-wrapper';

        inputWrapper.appendChild(inputElement);

        const maxButton = document.createElement('button');
        maxButton.type = 'button';
        maxButton.className = 'max-button';
        maxButton.innerText = 'Max';
        maxButton.addEventListener('click', async () => {
          await handleMaxButtonClick(form);
        });

        inputWrapper.appendChild(maxButton);
        formGroup.appendChild(inputWrapper);
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
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'button submit-button';
    submitButton.innerText = 'Submit';
    form.appendChild(submitButton);

    formContainer.appendChild(form);
    methodFormsContainer.appendChild(formContainer);

    // Add event listeners for updating Max button when selections change
    form.addEventListener('change', () => updateMaxButton(form));

    // Call updateMaxButton to initialize the Max button
    updateMaxButton(form);
  });

  // Include code for extra tools
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

      method.inputs.forEach((input) => {
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
      });

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
    // Add other facets if needed
  };

  return facets[facet];
}

// Function to Handle Form Submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const methodName = form.getAttribute('data-method');
  const selectedFacet = 'EscrowFacet';
  const facetMethods = getFacetMethods(selectedFacet);
  const method = facetMethods[methodName];
  const formData = new FormData(form);

  const args = [];
  try {
    // Handle _tokenId or _tokenIds
    const methodsRequiringTokenId = ['transferEscrow', 'depositERC20'];
    const methodsRequiringTokenIds = ['batchTransferEscrow', 'batchDepositERC20', 'batchDepositGHST'];
    if (methodsRequiringTokenId.includes(methodName)) {
      const tokenIdValue = formData.get('_tokenId');
      let _tokenId;
      if (tokenIdValue === 'all') {
        throw new Error('Please use batch methods for multiple Aavegotchis.');
      } else {
        _tokenId = ethers.BigNumber.from(tokenIdValue);
      }
      args.push(_tokenId);

      // Validate ownership
      const ownedTokenIds = ownedAavegotchis.map((gotchi) => gotchi.tokenId.toString());
      if (!ownedTokenIds.includes(_tokenId.toString())) {
        throw new Error('You do not own the selected Aavegotchi.');
      }
    } else if (methodsRequiringTokenIds.includes(methodName)) {
      let _tokenIds = formData.get('_tokenIds')?.trim() || '';
      if (_tokenIds === 'all') {
        _tokenIds = ownedAavegotchis.map((gotchi) => gotchi.tokenId.toString());
      } else {
        _tokenIds = _tokenIds.split(',').map((id) => id.trim()).filter((id) => id !== '');
      }
      _tokenIds = _tokenIds.map((id) => ethers.BigNumber.from(id));

      // Validate ownership
      const ownedTokenIds = ownedAavegotchis.map((gotchi) => gotchi.tokenId.toString());
      const invalidIds = _tokenIds.filter((id) => !ownedTokenIds.includes(id.toString()));
      if (invalidIds.length > 0) {
        throw new Error(`You do not own the Aavegotchis with IDs: ${invalidIds.join(', ')}`);
      }
      args.push(_tokenIds);
    }

    for (const input of method.inputs) {
      if (
        (methodsRequiringTokenId.includes(methodName) && input.name === '_tokenId') ||
        (methodsRequiringTokenIds.includes(methodName) && input.name === '_tokenIds') ||
        (methodName === 'transferEscrow' && input.name === '_recipient')
      ) {
        continue;
      }

      let value = formData.get(input.name)?.trim() || '';

      const isAmountField = ['_transferAmount', '_transferAmounts', '_value', '_values'].includes(input.name);

      if (input.type.endsWith('[]')) {
        value = value.split(',').map((item) => item.trim()).filter((item) => item !== '');
        if (isAmountField) {
          value = value.map((item) => {
            if (!/^\d+(\.\d+)?$/.test(item)) {
              throw new Error(`Invalid number in ${input.name}: ${item}`);
            }
            return ethers.utils.parseUnits(item, 18);
          });
        } else if (input.type.startsWith('address')) {
          value.forEach((address) => {
            if (!ethers.utils.isAddress(address)) {
              throw new Error(`Invalid address in ${input.name}: ${address}`);
            }
          });
        }
      } else {
        if (methodName === 'transferEscrow' && input.name === '_erc20Contract') {
          if (value === 'custom') {
            const customAddress = formData.get('custom-erc20-address')?.trim();
            if (!customAddress || !ethers.utils.isAddress(customAddress)) {
              throw new Error('Please provide a valid custom ERC20 contract address.');
            }
            value = customAddress;
          }
        }

        if (isAmountField) {
          if (!/^\d+(\.\d+)?$/.test(value)) {
            throw new Error(`Invalid number for ${input.name}`);
          }
          value = ethers.utils.parseUnits(value, 18);
        } else {
          if (input.type.startsWith('uint')) {
            if (!/^\d+$/.test(value)) {
              throw new Error(`Invalid number for ${input.name}`);
            }
            value = ethers.BigNumber.from(value);
          } else if (input.type.startsWith('address')) {
            if (!ethers.utils.isAddress(value)) {
              throw new Error(`Invalid address for ${input.name}: ${value}`);
            }
          }
        }
      }
      args.push(value);
    }

    if (methodName === 'transferEscrow' || methodName === 'batchTransferEscrow') {
      if (!userAddress) {
        throw new Error('User address not found. Please reconnect your wallet.');
      }
      if (methodName === 'transferEscrow') {
        args.splice(2, 0, userAddress); // Insert _recipient at the correct position
      } else if (methodName === 'batchTransferEscrow') {
        const _recipients = Array(args[0].length).fill(userAddress);
        args.splice(2, 0, _recipients); // Insert _recipients at the correct position
      }
    }

    const tx = await contract[methodName](...args);
    alert(`Transaction submitted. Hash: ${tx.hash}`);
    await tx.wait();
    alert('Transaction confirmed!');
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.data?.message || error.message}`);
  }
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

    aavegotchis.forEach((aavegotchi, index) => {
      const isLent = lendingStatuses[index];
      const isOwned = !isLent;

      if (isOwned) {
        ownedAavegotchis.push(aavegotchi);
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
      const ghstBalance = ethers.utils.formatUnits(ghstBalanceRaw, ghstDecimals);
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

  if (!erc20Address || !ethers.utils.isAddress(erc20Address)) {
    return;
  }

  const amountInput = form.querySelector('input[name="_transferAmount"]');
  const maxButton = form.querySelector('.max-button');

  if (!tokenIdValue || !amountInput || !maxButton) return;

  // Disable Max button until balances are fetched
  maxButton.disabled = true;
  maxButton.innerText = 'Loading...';

  try {
    let totalBalance = ethers.BigNumber.from(0);
    const tokenContract = new ethers.Contract(erc20Address, ghstABI, provider);

    if (tokenIdValue === 'all') {
      const balancePromises = ownedAavegotchis.map(async (gotchi) => {
        const escrowWallet = gotchi.escrow;
        const balance = await tokenContract.balanceOf(escrowWallet);
        return balance;
      });

      const balances = await Promise.all(balancePromises);
      balances.forEach((balance) => {
        totalBalance = totalBalance.add(balance);
      });
    } else {
      const gotchi = ownedAavegotchis.find((g) => g.tokenId.toString() === tokenIdValue);
      if (!gotchi) throw new Error('Selected Aavegotchi not found.');
      const escrowWallet = gotchi.escrow;
      totalBalance = await tokenContract.balanceOf(escrowWallet);
    }

    maxButton.dataset.maxValue = totalBalance.toString();
    maxButton.disabled = false;
    maxButton.innerText = 'Max';
  } catch (error) {
    console.error('Error fetching token balance:', error);
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
    const decimals = 18; // Assuming 18 decimals for tokens
    const formattedValue = ethers.utils.formatUnits(maxValue, decimals);
    amountInput.value = formattedValue;
  }
}

// Initial call to generate method forms if the wallet is already connected
window.onload = async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
};
