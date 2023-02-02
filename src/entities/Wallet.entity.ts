import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { Wallet as WalletProto } from "../common/immuWallet.dto";
import { Transaction } from "./Transaction.entity";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    balance: number;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => Transaction, transaction => transaction.wallet)
    transactions: Transaction[]

    toProto(): WalletProto {
        return {
            id: this.id,
            token: this.token,
            balance: this.balance,
            user_id: this.user.id
        }
    }
}