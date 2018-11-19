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

    function transferFund(address _transferTo, uint _requiredCarbonPercDecrease, uint _transactionId) public payable returns (bool){
        _transferTo.transfer(msg.value);
        transactionCount++;
        transactionsMap[_transactionId] = SingleTransaction(msg.sender, _transferTo, _requiredCarbonPercDecrease, 0, false, now, now);
        emit TransferFund(_transferTo, msg.sender, msg.value, _transactionId);
        return true;
    }
    
    function getBalanceOfCurrentAccount() public payable returns (uint) {
        return msg.sender.balance;
    }

    function editTransactionCarbonReducProgress(uint _transactionMapKey, uint _carbonReducProgress) public returns (bool) {
        transactionsMap[_transactionMapKey].carbonReducProgress = _carbonReducProgress;
        transactionsMap[_transactionMapKey].contractLastUpdateDate = now;
        if(_carbonReducProgress >= transactionsMap[_transactionMapKey].requiredCarbonPercDecrease) {
            transactionsMap[_transactionMapKey].contractCompleted = true;
        }
        return true;
    }

    function getSingleTransactionWithMapKey(uint _transactionMapKey) public returns(uint, uint, bool, uint, uint) {
        SingleTransaction singleTransaction = transactionsMap[_transactionMapKey];
        return (singleTransaction.requiredCarbonPercDecrease, singleTransaction.carbonReducProgress,
            singleTransaction.contractCompleted, singleTransaction.contractDate,  singleTransaction.contractLastUpdateDate);
    }
}