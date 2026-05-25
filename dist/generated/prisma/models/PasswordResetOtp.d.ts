import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PasswordResetOtpModel = runtime.Types.Result.DefaultSelection<Prisma.$PasswordResetOtpPayload>;
export type AggregatePasswordResetOtp = {
    _count: PasswordResetOtpCountAggregateOutputType | null;
    _avg: PasswordResetOtpAvgAggregateOutputType | null;
    _sum: PasswordResetOtpSumAggregateOutputType | null;
    _min: PasswordResetOtpMinAggregateOutputType | null;
    _max: PasswordResetOtpMaxAggregateOutputType | null;
};
export type PasswordResetOtpAvgAggregateOutputType = {
    attempts: number | null;
};
export type PasswordResetOtpSumAggregateOutputType = {
    attempts: number | null;
};
export type PasswordResetOtpMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    otpHash: string | null;
    expiresAt: Date | null;
    attempts: number | null;
    used: boolean | null;
    createdAt: Date | null;
};
export type PasswordResetOtpMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    otpHash: string | null;
    expiresAt: Date | null;
    attempts: number | null;
    used: boolean | null;
    createdAt: Date | null;
};
export type PasswordResetOtpCountAggregateOutputType = {
    id: number;
    userId: number;
    otpHash: number;
    expiresAt: number;
    attempts: number;
    used: number;
    createdAt: number;
    _all: number;
};
export type PasswordResetOtpAvgAggregateInputType = {
    attempts?: true;
};
export type PasswordResetOtpSumAggregateInputType = {
    attempts?: true;
};
export type PasswordResetOtpMinAggregateInputType = {
    id?: true;
    userId?: true;
    otpHash?: true;
    expiresAt?: true;
    attempts?: true;
    used?: true;
    createdAt?: true;
};
export type PasswordResetOtpMaxAggregateInputType = {
    id?: true;
    userId?: true;
    otpHash?: true;
    expiresAt?: true;
    attempts?: true;
    used?: true;
    createdAt?: true;
};
export type PasswordResetOtpCountAggregateInputType = {
    id?: true;
    userId?: true;
    otpHash?: true;
    expiresAt?: true;
    attempts?: true;
    used?: true;
    createdAt?: true;
    _all?: true;
};
export type PasswordResetOtpAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PasswordResetOtpWhereInput;
    orderBy?: Prisma.PasswordResetOtpOrderByWithRelationInput | Prisma.PasswordResetOtpOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PasswordResetOtpCountAggregateInputType;
    _avg?: PasswordResetOtpAvgAggregateInputType;
    _sum?: PasswordResetOtpSumAggregateInputType;
    _min?: PasswordResetOtpMinAggregateInputType;
    _max?: PasswordResetOtpMaxAggregateInputType;
};
export type GetPasswordResetOtpAggregateType<T extends PasswordResetOtpAggregateArgs> = {
    [P in keyof T & keyof AggregatePasswordResetOtp]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePasswordResetOtp[P]> : Prisma.GetScalarType<T[P], AggregatePasswordResetOtp[P]>;
};
export type PasswordResetOtpGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PasswordResetOtpWhereInput;
    orderBy?: Prisma.PasswordResetOtpOrderByWithAggregationInput | Prisma.PasswordResetOtpOrderByWithAggregationInput[];
    by: Prisma.PasswordResetOtpScalarFieldEnum[] | Prisma.PasswordResetOtpScalarFieldEnum;
    having?: Prisma.PasswordResetOtpScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PasswordResetOtpCountAggregateInputType | true;
    _avg?: PasswordResetOtpAvgAggregateInputType;
    _sum?: PasswordResetOtpSumAggregateInputType;
    _min?: PasswordResetOtpMinAggregateInputType;
    _max?: PasswordResetOtpMaxAggregateInputType;
};
export type PasswordResetOtpGroupByOutputType = {
    id: string;
    userId: string;
    otpHash: string;
    expiresAt: Date;
    attempts: number;
    used: boolean;
    createdAt: Date;
    _count: PasswordResetOtpCountAggregateOutputType | null;
    _avg: PasswordResetOtpAvgAggregateOutputType | null;
    _sum: PasswordResetOtpSumAggregateOutputType | null;
    _min: PasswordResetOtpMinAggregateOutputType | null;
    _max: PasswordResetOtpMaxAggregateOutputType | null;
};
type GetPasswordResetOtpGroupByPayload<T extends PasswordResetOtpGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PasswordResetOtpGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PasswordResetOtpGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PasswordResetOtpGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PasswordResetOtpGroupByOutputType[P]>;
}>>;
export type PasswordResetOtpWhereInput = {
    AND?: Prisma.PasswordResetOtpWhereInput | Prisma.PasswordResetOtpWhereInput[];
    OR?: Prisma.PasswordResetOtpWhereInput[];
    NOT?: Prisma.PasswordResetOtpWhereInput | Prisma.PasswordResetOtpWhereInput[];
    id?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    userId?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    otpHash?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PasswordResetOtp"> | Date | string;
    attempts?: Prisma.IntFilter<"PasswordResetOtp"> | number;
    used?: Prisma.BoolFilter<"PasswordResetOtp"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"PasswordResetOtp"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PasswordResetOtpOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    used?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type PasswordResetOtpWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PasswordResetOtpWhereInput | Prisma.PasswordResetOtpWhereInput[];
    OR?: Prisma.PasswordResetOtpWhereInput[];
    NOT?: Prisma.PasswordResetOtpWhereInput | Prisma.PasswordResetOtpWhereInput[];
    userId?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    otpHash?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PasswordResetOtp"> | Date | string;
    attempts?: Prisma.IntFilter<"PasswordResetOtp"> | number;
    used?: Prisma.BoolFilter<"PasswordResetOtp"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"PasswordResetOtp"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type PasswordResetOtpOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    used?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PasswordResetOtpCountOrderByAggregateInput;
    _avg?: Prisma.PasswordResetOtpAvgOrderByAggregateInput;
    _max?: Prisma.PasswordResetOtpMaxOrderByAggregateInput;
    _min?: Prisma.PasswordResetOtpMinOrderByAggregateInput;
    _sum?: Prisma.PasswordResetOtpSumOrderByAggregateInput;
};
export type PasswordResetOtpScalarWhereWithAggregatesInput = {
    AND?: Prisma.PasswordResetOtpScalarWhereWithAggregatesInput | Prisma.PasswordResetOtpScalarWhereWithAggregatesInput[];
    OR?: Prisma.PasswordResetOtpScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PasswordResetOtpScalarWhereWithAggregatesInput | Prisma.PasswordResetOtpScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PasswordResetOtp"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"PasswordResetOtp"> | string;
    otpHash?: Prisma.StringWithAggregatesFilter<"PasswordResetOtp"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"PasswordResetOtp"> | Date | string;
    attempts?: Prisma.IntWithAggregatesFilter<"PasswordResetOtp"> | number;
    used?: Prisma.BoolWithAggregatesFilter<"PasswordResetOtp"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PasswordResetOtp"> | Date | string;
};
export type PasswordResetOtpCreateInput = {
    id?: string;
    otpHash: string;
    expiresAt: Date | string;
    attempts?: number;
    used?: boolean;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPasswordResetOtpsInput;
};
export type PasswordResetOtpUncheckedCreateInput = {
    id?: string;
    userId: string;
    otpHash: string;
    expiresAt: Date | string;
    attempts?: number;
    used?: boolean;
    createdAt?: Date | string;
};
export type PasswordResetOtpUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPasswordResetOtpsNestedInput;
};
export type PasswordResetOtpUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetOtpCreateManyInput = {
    id?: string;
    userId: string;
    otpHash: string;
    expiresAt: Date | string;
    attempts?: number;
    used?: boolean;
    createdAt?: Date | string;
};
export type PasswordResetOtpUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetOtpUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetOtpListRelationFilter = {
    every?: Prisma.PasswordResetOtpWhereInput;
    some?: Prisma.PasswordResetOtpWhereInput;
    none?: Prisma.PasswordResetOtpWhereInput;
};
export type PasswordResetOtpOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PasswordResetOtpCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    used?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PasswordResetOtpAvgOrderByAggregateInput = {
    attempts?: Prisma.SortOrder;
};
export type PasswordResetOtpMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    used?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PasswordResetOtpMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    used?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PasswordResetOtpSumOrderByAggregateInput = {
    attempts?: Prisma.SortOrder;
};
export type PasswordResetOtpCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PasswordResetOtpCreateWithoutUserInput, Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput> | Prisma.PasswordResetOtpCreateWithoutUserInput[] | Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput | Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PasswordResetOtpCreateManyUserInputEnvelope;
    connect?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
};
export type PasswordResetOtpUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PasswordResetOtpCreateWithoutUserInput, Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput> | Prisma.PasswordResetOtpCreateWithoutUserInput[] | Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput | Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PasswordResetOtpCreateManyUserInputEnvelope;
    connect?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
};
export type PasswordResetOtpUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PasswordResetOtpCreateWithoutUserInput, Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput> | Prisma.PasswordResetOtpCreateWithoutUserInput[] | Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput | Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PasswordResetOtpUpsertWithWhereUniqueWithoutUserInput | Prisma.PasswordResetOtpUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PasswordResetOtpCreateManyUserInputEnvelope;
    set?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    disconnect?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    delete?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    connect?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    update?: Prisma.PasswordResetOtpUpdateWithWhereUniqueWithoutUserInput | Prisma.PasswordResetOtpUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PasswordResetOtpUpdateManyWithWhereWithoutUserInput | Prisma.PasswordResetOtpUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PasswordResetOtpScalarWhereInput | Prisma.PasswordResetOtpScalarWhereInput[];
};
export type PasswordResetOtpUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PasswordResetOtpCreateWithoutUserInput, Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput> | Prisma.PasswordResetOtpCreateWithoutUserInput[] | Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput | Prisma.PasswordResetOtpCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PasswordResetOtpUpsertWithWhereUniqueWithoutUserInput | Prisma.PasswordResetOtpUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PasswordResetOtpCreateManyUserInputEnvelope;
    set?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    disconnect?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    delete?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    connect?: Prisma.PasswordResetOtpWhereUniqueInput | Prisma.PasswordResetOtpWhereUniqueInput[];
    update?: Prisma.PasswordResetOtpUpdateWithWhereUniqueWithoutUserInput | Prisma.PasswordResetOtpUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PasswordResetOtpUpdateManyWithWhereWithoutUserInput | Prisma.PasswordResetOtpUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PasswordResetOtpScalarWhereInput | Prisma.PasswordResetOtpScalarWhereInput[];
};
export type PasswordResetOtpCreateWithoutUserInput = {
    id?: string;
    otpHash: string;
    expiresAt: Date | string;
    attempts?: number;
    used?: boolean;
    createdAt?: Date | string;
};
export type PasswordResetOtpUncheckedCreateWithoutUserInput = {
    id?: string;
    otpHash: string;
    expiresAt: Date | string;
    attempts?: number;
    used?: boolean;
    createdAt?: Date | string;
};
export type PasswordResetOtpCreateOrConnectWithoutUserInput = {
    where: Prisma.PasswordResetOtpWhereUniqueInput;
    create: Prisma.XOR<Prisma.PasswordResetOtpCreateWithoutUserInput, Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput>;
};
export type PasswordResetOtpCreateManyUserInputEnvelope = {
    data: Prisma.PasswordResetOtpCreateManyUserInput | Prisma.PasswordResetOtpCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type PasswordResetOtpUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.PasswordResetOtpWhereUniqueInput;
    update: Prisma.XOR<Prisma.PasswordResetOtpUpdateWithoutUserInput, Prisma.PasswordResetOtpUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PasswordResetOtpCreateWithoutUserInput, Prisma.PasswordResetOtpUncheckedCreateWithoutUserInput>;
};
export type PasswordResetOtpUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.PasswordResetOtpWhereUniqueInput;
    data: Prisma.XOR<Prisma.PasswordResetOtpUpdateWithoutUserInput, Prisma.PasswordResetOtpUncheckedUpdateWithoutUserInput>;
};
export type PasswordResetOtpUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.PasswordResetOtpScalarWhereInput;
    data: Prisma.XOR<Prisma.PasswordResetOtpUpdateManyMutationInput, Prisma.PasswordResetOtpUncheckedUpdateManyWithoutUserInput>;
};
export type PasswordResetOtpScalarWhereInput = {
    AND?: Prisma.PasswordResetOtpScalarWhereInput | Prisma.PasswordResetOtpScalarWhereInput[];
    OR?: Prisma.PasswordResetOtpScalarWhereInput[];
    NOT?: Prisma.PasswordResetOtpScalarWhereInput | Prisma.PasswordResetOtpScalarWhereInput[];
    id?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    userId?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    otpHash?: Prisma.StringFilter<"PasswordResetOtp"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PasswordResetOtp"> | Date | string;
    attempts?: Prisma.IntFilter<"PasswordResetOtp"> | number;
    used?: Prisma.BoolFilter<"PasswordResetOtp"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"PasswordResetOtp"> | Date | string;
};
export type PasswordResetOtpCreateManyUserInput = {
    id?: string;
    otpHash: string;
    expiresAt: Date | string;
    attempts?: number;
    used?: boolean;
    createdAt?: Date | string;
};
export type PasswordResetOtpUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetOtpUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetOtpUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    used?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetOtpSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    used?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["passwordResetOtp"]>;
export type PasswordResetOtpSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    used?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["passwordResetOtp"]>;
export type PasswordResetOtpSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    used?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["passwordResetOtp"]>;
export type PasswordResetOtpSelectScalar = {
    id?: boolean;
    userId?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    used?: boolean;
    createdAt?: boolean;
};
export type PasswordResetOtpOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "otpHash" | "expiresAt" | "attempts" | "used" | "createdAt", ExtArgs["result"]["passwordResetOtp"]>;
export type PasswordResetOtpInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PasswordResetOtpIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PasswordResetOtpIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PasswordResetOtpPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PasswordResetOtp";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        otpHash: string;
        expiresAt: Date;
        attempts: number;
        used: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["passwordResetOtp"]>;
    composites: {};
};
export type PasswordResetOtpGetPayload<S extends boolean | null | undefined | PasswordResetOtpDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload, S>;
export type PasswordResetOtpCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PasswordResetOtpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PasswordResetOtpCountAggregateInputType | true;
};
export interface PasswordResetOtpDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetOtp'];
        meta: {
            name: 'PasswordResetOtp';
        };
    };
    findUnique<T extends PasswordResetOtpFindUniqueArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PasswordResetOtpFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PasswordResetOtpFindFirstArgs>(args?: Prisma.SelectSubset<T, PasswordResetOtpFindFirstArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PasswordResetOtpFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PasswordResetOtpFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PasswordResetOtpFindManyArgs>(args?: Prisma.SelectSubset<T, PasswordResetOtpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PasswordResetOtpCreateArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpCreateArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PasswordResetOtpCreateManyArgs>(args?: Prisma.SelectSubset<T, PasswordResetOtpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PasswordResetOtpCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PasswordResetOtpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PasswordResetOtpDeleteArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpDeleteArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PasswordResetOtpUpdateArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpUpdateArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PasswordResetOtpDeleteManyArgs>(args?: Prisma.SelectSubset<T, PasswordResetOtpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PasswordResetOtpUpdateManyArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PasswordResetOtpUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PasswordResetOtpUpsertArgs>(args: Prisma.SelectSubset<T, PasswordResetOtpUpsertArgs<ExtArgs>>): Prisma.Prisma__PasswordResetOtpClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetOtpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PasswordResetOtpCountArgs>(args?: Prisma.Subset<T, PasswordResetOtpCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PasswordResetOtpCountAggregateOutputType> : number>;
    aggregate<T extends PasswordResetOtpAggregateArgs>(args: Prisma.Subset<T, PasswordResetOtpAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetOtpAggregateType<T>>;
    groupBy<T extends PasswordResetOtpGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PasswordResetOtpGroupByArgs['orderBy'];
    } : {
        orderBy?: PasswordResetOtpGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PasswordResetOtpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetOtpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PasswordResetOtpFieldRefs;
}
export interface Prisma__PasswordResetOtpClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PasswordResetOtpFieldRefs {
    readonly id: Prisma.FieldRef<"PasswordResetOtp", 'String'>;
    readonly userId: Prisma.FieldRef<"PasswordResetOtp", 'String'>;
    readonly otpHash: Prisma.FieldRef<"PasswordResetOtp", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"PasswordResetOtp", 'DateTime'>;
    readonly attempts: Prisma.FieldRef<"PasswordResetOtp", 'Int'>;
    readonly used: Prisma.FieldRef<"PasswordResetOtp", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"PasswordResetOtp", 'DateTime'>;
}
export type PasswordResetOtpFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where: Prisma.PasswordResetOtpWhereUniqueInput;
};
export type PasswordResetOtpFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where: Prisma.PasswordResetOtpWhereUniqueInput;
};
export type PasswordResetOtpFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where?: Prisma.PasswordResetOtpWhereInput;
    orderBy?: Prisma.PasswordResetOtpOrderByWithRelationInput | Prisma.PasswordResetOtpOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PasswordResetOtpScalarFieldEnum | Prisma.PasswordResetOtpScalarFieldEnum[];
};
export type PasswordResetOtpFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where?: Prisma.PasswordResetOtpWhereInput;
    orderBy?: Prisma.PasswordResetOtpOrderByWithRelationInput | Prisma.PasswordResetOtpOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PasswordResetOtpScalarFieldEnum | Prisma.PasswordResetOtpScalarFieldEnum[];
};
export type PasswordResetOtpFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where?: Prisma.PasswordResetOtpWhereInput;
    orderBy?: Prisma.PasswordResetOtpOrderByWithRelationInput | Prisma.PasswordResetOtpOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetOtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PasswordResetOtpScalarFieldEnum | Prisma.PasswordResetOtpScalarFieldEnum[];
};
export type PasswordResetOtpCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PasswordResetOtpCreateInput, Prisma.PasswordResetOtpUncheckedCreateInput>;
};
export type PasswordResetOtpCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PasswordResetOtpCreateManyInput | Prisma.PasswordResetOtpCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PasswordResetOtpCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    data: Prisma.PasswordResetOtpCreateManyInput | Prisma.PasswordResetOtpCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PasswordResetOtpIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PasswordResetOtpUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PasswordResetOtpUpdateInput, Prisma.PasswordResetOtpUncheckedUpdateInput>;
    where: Prisma.PasswordResetOtpWhereUniqueInput;
};
export type PasswordResetOtpUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PasswordResetOtpUpdateManyMutationInput, Prisma.PasswordResetOtpUncheckedUpdateManyInput>;
    where?: Prisma.PasswordResetOtpWhereInput;
    limit?: number;
};
export type PasswordResetOtpUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PasswordResetOtpUpdateManyMutationInput, Prisma.PasswordResetOtpUncheckedUpdateManyInput>;
    where?: Prisma.PasswordResetOtpWhereInput;
    limit?: number;
    include?: Prisma.PasswordResetOtpIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PasswordResetOtpUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where: Prisma.PasswordResetOtpWhereUniqueInput;
    create: Prisma.XOR<Prisma.PasswordResetOtpCreateInput, Prisma.PasswordResetOtpUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PasswordResetOtpUpdateInput, Prisma.PasswordResetOtpUncheckedUpdateInput>;
};
export type PasswordResetOtpDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
    where: Prisma.PasswordResetOtpWhereUniqueInput;
};
export type PasswordResetOtpDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PasswordResetOtpWhereInput;
    limit?: number;
};
export type PasswordResetOtpDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetOtpSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetOtpOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetOtpInclude<ExtArgs> | null;
};
export {};
