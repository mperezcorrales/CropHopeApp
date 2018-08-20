export interface Transaction {
    fromId: string;
    toId: string;
    fromEthereumId: string;
    toEthereumId: string;
    date: string;
    amount: number;
    smartContractId?: string;
}
