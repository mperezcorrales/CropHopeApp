pragma solidity ^0.4.17;

contract Transaction {

    struct SingleTransaction {
        address ngoSender;
        address agriReceiver;
        uint requiredCarbonPercDecrease;
        uint carbonReducProgress;
        bool contractCompleted;    
        uint contractDate;
        uint contractLastUpdateDate;
    }

    // Store Transactions Count
    uint public transactionCount;

    mapping(uint => SingleTransaction) public transactionsMap;

    event TransferFund(address _transferTo, address _transferFrom, uint _amount, uint _transactionMapKey);

    constructor() public {        
    }

    function transferFund(address _transferTo, uint requiredCarbonPercDecrease) public payable returns (bool){
        _transferTo.transfer(msg.value);
        transactionCount++;
        transactionsMap[transactionCount] = SingleTransaction(msg.sender, _transferTo, requiredCarbonPercDecrease, 0, false, now, now);
        emit TransferFund(_transferTo, msg.sender, msg.value, transactionCount);
        return true;
    }
    
    function getBalanceOfCurrentAccount() public payable returns (uint) {
        return msg.sender.balance;
    }

    function editTransactionCarbonReducProgress(uint _transactionMapKey, uint _carbonReducProgress) public {
        transactionsMap[_transactionMapKey].carbonReducProgress = _carbonReducProgress;
        transactionsMap[_transactionMapKey].contractLastUpdateDate = now;
        if(_carbonReducProgress >= transactionsMap[_transactionMapKey].requiredCarbonPercDecrease) {
            transactionsMap[_transactionMapKey].contractCompleted = true;
        }
    }
}