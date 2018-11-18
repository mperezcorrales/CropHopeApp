export interface Transaction {
    id?: string;
    status?: string;
    denied?: boolean;
    accepted?: boolean;
    availableForEthTransaction?: boolean;
    ethTransactionCompleted?: boolean;
    acceptedByFrom: boolean;
    acceptedByTo: boolean;
    fromId: string;
    fromName: string;
    fromEmail: string;
    toId: string;
    givingToCompanyName: string;
    carbonReductionPerc: string;
    timeWindow: string;
    currentDate: string;
    amount: string;
}
