import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Wallet } from "./Wallet.entity";

@Entity()
export class User {
    @PrimaryColumn()
    id: number;

    @OneToMany(() => Wallet, (wallet) => wallet.user)
    wallets?: Wallet[];
}