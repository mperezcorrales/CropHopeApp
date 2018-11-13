pragma solidity ^0.4.17;

contract Transaction {

    struct SingleTransaction {
        address ngoSender;
        address agriReceiver;
        uint requiredCarbonPercDecrease;
        uint carbonReducProgress;
        bool contractCompleted;    
        bool contractExpired;
    }

    // Store Transactions Count
    uint public transactionCount;

    mapping(address => SingleTransaction) public transactionsMap;

    event TransferFund(address _transferTo, address _transferFrom, uint amount);

    constructor() public {        
    }

    event TransferFund(address _transferTo, address _transferFrom, uint amount);

    function transferFund(address _transferTo, uint requiredCarbonPercDecrease) public payable returns (bool){
        _transferTo.transfer(msg.value);
        transactionCount++;
        transactionsMap[transactionCount] = SingleTransaction(msg.sender, _transferTo, requiredCarbonPercDecrease, 0, false, false);
        emit TransferFund(transferTo, transferFrom, msg.value);
        return true;
    }
    
    function getBalanceOfCurrentAccount() public payable returns (uint) {
        return transferFrom.balance;
    }
}