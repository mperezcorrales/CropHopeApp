export interface Transaction {
    id?: string;
    status?: string;
    denied?: boolean;
    accepted?: boolean;
    availableForEthTransaction?: boolean;
    ethTransactionCompleted?: boolean;
    fromEthAddress?: string;
    toEthAddress?: string;
    transactionEthId?: number;
    acceptedByFrom: boolean;
    acceptedByTo: boolean;
    fromId: string;
    fromName: string;
    fromEmail: string;
    toId: string;
    givingToCompanyName: string;
    carbonReductionPerc: string;
    carbonReductionProg?: string;
    timeWindow: string;
    currentDate: string;
    amount: string;
}
