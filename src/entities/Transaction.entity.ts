import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transaction as TransactionProto } from "../common/immuWallet.dto";
import { Wallet } from "./Wallet.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Wallet)
    wallet: Wallet;

    @ManyToOne(() => Wallet)
    related_wallet: Wallet;

    @Column()
    type: "debit" | "credit"

    @Column()
    value: number;

    @Column()
    description: string;

    toProto(): TransactionProto {
        const from_wallet = this.type == "debit"  ? this.wallet : this.related_wallet;
        const to_wallet = this.type == "credit"  ? this.related_wallet : this.wallet;

        return {
            from: from_wallet.toProto(),
            to: to_wallet.toProto(),
            value: this.value,
            description: this.description
        }
    }
}