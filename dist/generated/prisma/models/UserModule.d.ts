import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModuleModel = runtime.Types.Result.DefaultSelection<Prisma.$UserModulePayload>;
export type AggregateUserModule = {
    _count: UserModuleCountAggregateOutputType | null;
    _min: UserModuleMinAggregateOutputType | null;
    _max: UserModuleMaxAggregateOutputType | null;
};
export type UserModuleMinAggregateOutputType = {
    userId: string | null;
    moduleId: string | null;
    createdAt: Date | null;
};
export type UserModuleMaxAggregateOutputType = {
    userId: string | null;
    moduleId: string | null;
    createdAt: Date | null;
};
export type UserModuleCountAggregateOutputType = {
    userId: number;
    moduleId: number;
    createdAt: number;
    _all: number;
};
export type UserModuleMinAggregateInputType = {
    userId?: true;
    moduleId?: true;
    createdAt?: true;
};
export type UserModuleMaxAggregateInputType = {
    userId?: true;
    moduleId?: true;
    createdAt?: true;
};
export type UserModuleCountAggregateInputType = {
    userId?: true;
    moduleId?: true;
    createdAt?: true;
    _all?: true;
};
export type UserModuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserModuleWhereInput;
    orderBy?: Prisma.UserModuleOrderByWithRelationInput | Prisma.UserModuleOrderByWithRelationInput[];
    cursor?: Prisma.UserModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserModuleCountAggregateInputType;
    _min?: UserModuleMinAggregateInputType;
    _max?: UserModuleMaxAggregateInputType;
};
export type GetUserModuleAggregateType<T extends UserModuleAggregateArgs> = {
    [P in keyof T & keyof AggregateUserModule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserModule[P]> : Prisma.GetScalarType<T[P], AggregateUserModule[P]>;
};
export type UserModuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserModuleWhereInput;
    orderBy?: Prisma.UserModuleOrderByWithAggregationInput | Prisma.UserModuleOrderByWithAggregationInput[];
    by: Prisma.UserModuleScalarFieldEnum[] | Prisma.UserModuleScalarFieldEnum;
    having?: Prisma.UserModuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserModuleCountAggregateInputType | true;
    _min?: UserModuleMinAggregateInputType;
    _max?: UserModuleMaxAggregateInputType;
};
export type UserModuleGroupByOutputType = {
    userId: string;
    moduleId: string;
    createdAt: Date;
    _count: UserModuleCountAggregateOutputType | null;
    _min: UserModuleMinAggregateOutputType | null;
    _max: UserModuleMaxAggregateOutputType | null;
};
type GetUserModuleGroupByPayload<T extends UserModuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserModuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserModuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserModuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserModuleGroupByOutputType[P]>;
}>>;
export type UserModuleWhereInput = {
    AND?: Prisma.UserModuleWhereInput | Prisma.UserModuleWhereInput[];
    OR?: Prisma.UserModuleWhereInput[];
    NOT?: Prisma.UserModuleWhereInput | Prisma.UserModuleWhereInput[];
    userId?: Prisma.StringFilter<"UserModule"> | string;
    moduleId?: Prisma.StringFilter<"UserModule"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserModule"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>;
};
export type UserModuleOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    module?: Prisma.ModuleOrderByWithRelationInput;
};
export type UserModuleWhereUniqueInput = Prisma.AtLeast<{
    userId_moduleId?: Prisma.UserModuleUserIdModuleIdCompoundUniqueInput;
    AND?: Prisma.UserModuleWhereInput | Prisma.UserModuleWhereInput[];
    OR?: Prisma.UserModuleWhereInput[];
    NOT?: Prisma.UserModuleWhereInput | Prisma.UserModuleWhereInput[];
    userId?: Prisma.StringFilter<"UserModule"> | string;
    moduleId?: Prisma.StringFilter<"UserModule"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserModule"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>;
}, "userId_moduleId">;
export type UserModuleOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserModuleCountOrderByAggregateInput;
    _max?: Prisma.UserModuleMaxOrderByAggregateInput;
    _min?: Prisma.UserModuleMinOrderByAggregateInput;
};
export type UserModuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserModuleScalarWhereWithAggregatesInput | Prisma.UserModuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserModuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserModuleScalarWhereWithAggregatesInput | Prisma.UserModuleScalarWhereWithAggregatesInput[];
    userId?: Prisma.StringWithAggregatesFilter<"UserModule"> | string;
    moduleId?: Prisma.StringWithAggregatesFilter<"UserModule"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserModule"> | Date | string;
};
export type UserModuleCreateInput = {
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutModulesInput;
    module: Prisma.ModuleCreateNestedOneWithoutUsersInput;
};
export type UserModuleUncheckedCreateInput = {
    userId: string;
    moduleId: string;
    createdAt?: Date | string;
};
export type UserModuleUpdateInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutModulesNestedInput;
    module?: Prisma.ModuleUpdateOneRequiredWithoutUsersNestedInput;
};
export type UserModuleUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleCreateManyInput = {
    userId: string;
    moduleId: string;
    createdAt?: Date | string;
};
export type UserModuleUpdateManyMutationInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleListRelationFilter = {
    every?: Prisma.UserModuleWhereInput;
    some?: Prisma.UserModuleWhereInput;
    none?: Prisma.UserModuleWhereInput;
};
export type UserModuleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserModuleUserIdModuleIdCompoundUniqueInput = {
    userId: string;
    moduleId: string;
};
export type UserModuleCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserModuleMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserModuleMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserModuleCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutUserInput, Prisma.UserModuleUncheckedCreateWithoutUserInput> | Prisma.UserModuleCreateWithoutUserInput[] | Prisma.UserModuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutUserInput | Prisma.UserModuleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserModuleCreateManyUserInputEnvelope;
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
};
export type UserModuleUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutUserInput, Prisma.UserModuleUncheckedCreateWithoutUserInput> | Prisma.UserModuleCreateWithoutUserInput[] | Prisma.UserModuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutUserInput | Prisma.UserModuleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserModuleCreateManyUserInputEnvelope;
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
};
export type UserModuleUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutUserInput, Prisma.UserModuleUncheckedCreateWithoutUserInput> | Prisma.UserModuleCreateWithoutUserInput[] | Prisma.UserModuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutUserInput | Prisma.UserModuleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserModuleUpsertWithWhereUniqueWithoutUserInput | Prisma.UserModuleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserModuleCreateManyUserInputEnvelope;
    set?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    disconnect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    delete?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    update?: Prisma.UserModuleUpdateWithWhereUniqueWithoutUserInput | Prisma.UserModuleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserModuleUpdateManyWithWhereWithoutUserInput | Prisma.UserModuleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserModuleScalarWhereInput | Prisma.UserModuleScalarWhereInput[];
};
export type UserModuleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutUserInput, Prisma.UserModuleUncheckedCreateWithoutUserInput> | Prisma.UserModuleCreateWithoutUserInput[] | Prisma.UserModuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutUserInput | Prisma.UserModuleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserModuleUpsertWithWhereUniqueWithoutUserInput | Prisma.UserModuleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserModuleCreateManyUserInputEnvelope;
    set?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    disconnect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    delete?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    update?: Prisma.UserModuleUpdateWithWhereUniqueWithoutUserInput | Prisma.UserModuleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserModuleUpdateManyWithWhereWithoutUserInput | Prisma.UserModuleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserModuleScalarWhereInput | Prisma.UserModuleScalarWhereInput[];
};
export type UserModuleCreateNestedManyWithoutModuleInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutModuleInput, Prisma.UserModuleUncheckedCreateWithoutModuleInput> | Prisma.UserModuleCreateWithoutModuleInput[] | Prisma.UserModuleUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutModuleInput | Prisma.UserModuleCreateOrConnectWithoutModuleInput[];
    createMany?: Prisma.UserModuleCreateManyModuleInputEnvelope;
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
};
export type UserModuleUncheckedCreateNestedManyWithoutModuleInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutModuleInput, Prisma.UserModuleUncheckedCreateWithoutModuleInput> | Prisma.UserModuleCreateWithoutModuleInput[] | Prisma.UserModuleUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutModuleInput | Prisma.UserModuleCreateOrConnectWithoutModuleInput[];
    createMany?: Prisma.UserModuleCreateManyModuleInputEnvelope;
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
};
export type UserModuleUpdateManyWithoutModuleNestedInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutModuleInput, Prisma.UserModuleUncheckedCreateWithoutModuleInput> | Prisma.UserModuleCreateWithoutModuleInput[] | Prisma.UserModuleUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutModuleInput | Prisma.UserModuleCreateOrConnectWithoutModuleInput[];
    upsert?: Prisma.UserModuleUpsertWithWhereUniqueWithoutModuleInput | Prisma.UserModuleUpsertWithWhereUniqueWithoutModuleInput[];
    createMany?: Prisma.UserModuleCreateManyModuleInputEnvelope;
    set?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    disconnect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    delete?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    update?: Prisma.UserModuleUpdateWithWhereUniqueWithoutModuleInput | Prisma.UserModuleUpdateWithWhereUniqueWithoutModuleInput[];
    updateMany?: Prisma.UserModuleUpdateManyWithWhereWithoutModuleInput | Prisma.UserModuleUpdateManyWithWhereWithoutModuleInput[];
    deleteMany?: Prisma.UserModuleScalarWhereInput | Prisma.UserModuleScalarWhereInput[];
};
export type UserModuleUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: Prisma.XOR<Prisma.UserModuleCreateWithoutModuleInput, Prisma.UserModuleUncheckedCreateWithoutModuleInput> | Prisma.UserModuleCreateWithoutModuleInput[] | Prisma.UserModuleUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.UserModuleCreateOrConnectWithoutModuleInput | Prisma.UserModuleCreateOrConnectWithoutModuleInput[];
    upsert?: Prisma.UserModuleUpsertWithWhereUniqueWithoutModuleInput | Prisma.UserModuleUpsertWithWhereUniqueWithoutModuleInput[];
    createMany?: Prisma.UserModuleCreateManyModuleInputEnvelope;
    set?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    disconnect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    delete?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    connect?: Prisma.UserModuleWhereUniqueInput | Prisma.UserModuleWhereUniqueInput[];
    update?: Prisma.UserModuleUpdateWithWhereUniqueWithoutModuleInput | Prisma.UserModuleUpdateWithWhereUniqueWithoutModuleInput[];
    updateMany?: Prisma.UserModuleUpdateManyWithWhereWithoutModuleInput | Prisma.UserModuleUpdateManyWithWhereWithoutModuleInput[];
    deleteMany?: Prisma.UserModuleScalarWhereInput | Prisma.UserModuleScalarWhereInput[];
};
export type UserModuleCreateWithoutUserInput = {
    createdAt?: Date | string;
    module: Prisma.ModuleCreateNestedOneWithoutUsersInput;
};
export type UserModuleUncheckedCreateWithoutUserInput = {
    moduleId: string;
    createdAt?: Date | string;
};
export type UserModuleCreateOrConnectWithoutUserInput = {
    where: Prisma.UserModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserModuleCreateWithoutUserInput, Prisma.UserModuleUncheckedCreateWithoutUserInput>;
};
export type UserModuleCreateManyUserInputEnvelope = {
    data: Prisma.UserModuleCreateManyUserInput | Prisma.UserModuleCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserModuleUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserModuleWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserModuleUpdateWithoutUserInput, Prisma.UserModuleUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserModuleCreateWithoutUserInput, Prisma.UserModuleUncheckedCreateWithoutUserInput>;
};
export type UserModuleUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserModuleWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserModuleUpdateWithoutUserInput, Prisma.UserModuleUncheckedUpdateWithoutUserInput>;
};
export type UserModuleUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserModuleScalarWhereInput;
    data: Prisma.XOR<Prisma.UserModuleUpdateManyMutationInput, Prisma.UserModuleUncheckedUpdateManyWithoutUserInput>;
};
export type UserModuleScalarWhereInput = {
    AND?: Prisma.UserModuleScalarWhereInput | Prisma.UserModuleScalarWhereInput[];
    OR?: Prisma.UserModuleScalarWhereInput[];
    NOT?: Prisma.UserModuleScalarWhereInput | Prisma.UserModuleScalarWhereInput[];
    userId?: Prisma.StringFilter<"UserModule"> | string;
    moduleId?: Prisma.StringFilter<"UserModule"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserModule"> | Date | string;
};
export type UserModuleCreateWithoutModuleInput = {
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutModulesInput;
};
export type UserModuleUncheckedCreateWithoutModuleInput = {
    userId: string;
    createdAt?: Date | string;
};
export type UserModuleCreateOrConnectWithoutModuleInput = {
    where: Prisma.UserModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserModuleCreateWithoutModuleInput, Prisma.UserModuleUncheckedCreateWithoutModuleInput>;
};
export type UserModuleCreateManyModuleInputEnvelope = {
    data: Prisma.UserModuleCreateManyModuleInput | Prisma.UserModuleCreateManyModuleInput[];
    skipDuplicates?: boolean;
};
export type UserModuleUpsertWithWhereUniqueWithoutModuleInput = {
    where: Prisma.UserModuleWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserModuleUpdateWithoutModuleInput, Prisma.UserModuleUncheckedUpdateWithoutModuleInput>;
    create: Prisma.XOR<Prisma.UserModuleCreateWithoutModuleInput, Prisma.UserModuleUncheckedCreateWithoutModuleInput>;
};
export type UserModuleUpdateWithWhereUniqueWithoutModuleInput = {
    where: Prisma.UserModuleWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserModuleUpdateWithoutModuleInput, Prisma.UserModuleUncheckedUpdateWithoutModuleInput>;
};
export type UserModuleUpdateManyWithWhereWithoutModuleInput = {
    where: Prisma.UserModuleScalarWhereInput;
    data: Prisma.XOR<Prisma.UserModuleUpdateManyMutationInput, Prisma.UserModuleUncheckedUpdateManyWithoutModuleInput>;
};
export type UserModuleCreateManyUserInput = {
    moduleId: string;
    createdAt?: Date | string;
};
export type UserModuleUpdateWithoutUserInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.ModuleUpdateOneRequiredWithoutUsersNestedInput;
};
export type UserModuleUncheckedUpdateWithoutUserInput = {
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleUncheckedUpdateManyWithoutUserInput = {
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleCreateManyModuleInput = {
    userId: string;
    createdAt?: Date | string;
};
export type UserModuleUpdateWithoutModuleInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutModulesNestedInput;
};
export type UserModuleUncheckedUpdateWithoutModuleInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleUncheckedUpdateManyWithoutModuleInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserModuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    moduleId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userModule"]>;
export type UserModuleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    moduleId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userModule"]>;
export type UserModuleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    moduleId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userModule"]>;
export type UserModuleSelectScalar = {
    userId?: boolean;
    moduleId?: boolean;
    createdAt?: boolean;
};
export type UserModuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "moduleId" | "createdAt", ExtArgs["result"]["userModule"]>;
export type UserModuleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
};
export type UserModuleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
};
export type UserModuleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
};
export type $UserModulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserModule";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        module: Prisma.$ModulePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        moduleId: string;
        createdAt: Date;
    }, ExtArgs["result"]["userModule"]>;
    composites: {};
};
export type UserModuleGetPayload<S extends boolean | null | undefined | UserModuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserModulePayload, S>;
export type UserModuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserModuleCountAggregateInputType | true;
};
export interface UserModuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserModule'];
        meta: {
            name: 'UserModule';
        };
    };
    findUnique<T extends UserModuleFindUniqueArgs>(args: Prisma.SelectSubset<T, UserModuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserModuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserModuleFindFirstArgs>(args?: Prisma.SelectSubset<T, UserModuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserModuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserModuleFindManyArgs>(args?: Prisma.SelectSubset<T, UserModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserModuleCreateArgs>(args: Prisma.SelectSubset<T, UserModuleCreateArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserModuleCreateManyArgs>(args?: Prisma.SelectSubset<T, UserModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserModuleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserModuleDeleteArgs>(args: Prisma.SelectSubset<T, UserModuleDeleteArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserModuleUpdateArgs>(args: Prisma.SelectSubset<T, UserModuleUpdateArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserModuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserModuleUpdateManyArgs>(args: Prisma.SelectSubset<T, UserModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserModuleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserModuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserModuleUpsertArgs>(args: Prisma.SelectSubset<T, UserModuleUpsertArgs<ExtArgs>>): Prisma.Prisma__UserModuleClient<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserModuleCountArgs>(args?: Prisma.Subset<T, UserModuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserModuleCountAggregateOutputType> : number>;
    aggregate<T extends UserModuleAggregateArgs>(args: Prisma.Subset<T, UserModuleAggregateArgs>): Prisma.PrismaPromise<GetUserModuleAggregateType<T>>;
    groupBy<T extends UserModuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserModuleGroupByArgs['orderBy'];
    } : {
        orderBy?: UserModuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserModuleFieldRefs;
}
export interface Prisma__UserModuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    module<T extends Prisma.ModuleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ModuleDefaultArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserModuleFieldRefs {
    readonly userId: Prisma.FieldRef<"UserModule", 'String'>;
    readonly moduleId: Prisma.FieldRef<"UserModule", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserModule", 'DateTime'>;
}
export type UserModuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where: Prisma.UserModuleWhereUniqueInput;
};
export type UserModuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where: Prisma.UserModuleWhereUniqueInput;
};
export type UserModuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where?: Prisma.UserModuleWhereInput;
    orderBy?: Prisma.UserModuleOrderByWithRelationInput | Prisma.UserModuleOrderByWithRelationInput[];
    cursor?: Prisma.UserModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserModuleScalarFieldEnum | Prisma.UserModuleScalarFieldEnum[];
};
export type UserModuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where?: Prisma.UserModuleWhereInput;
    orderBy?: Prisma.UserModuleOrderByWithRelationInput | Prisma.UserModuleOrderByWithRelationInput[];
    cursor?: Prisma.UserModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserModuleScalarFieldEnum | Prisma.UserModuleScalarFieldEnum[];
};
export type UserModuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where?: Prisma.UserModuleWhereInput;
    orderBy?: Prisma.UserModuleOrderByWithRelationInput | Prisma.UserModuleOrderByWithRelationInput[];
    cursor?: Prisma.UserModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserModuleScalarFieldEnum | Prisma.UserModuleScalarFieldEnum[];
};
export type UserModuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserModuleCreateInput, Prisma.UserModuleUncheckedCreateInput>;
};
export type UserModuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserModuleCreateManyInput | Prisma.UserModuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserModuleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    data: Prisma.UserModuleCreateManyInput | Prisma.UserModuleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserModuleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserModuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserModuleUpdateInput, Prisma.UserModuleUncheckedUpdateInput>;
    where: Prisma.UserModuleWhereUniqueInput;
};
export type UserModuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserModuleUpdateManyMutationInput, Prisma.UserModuleUncheckedUpdateManyInput>;
    where?: Prisma.UserModuleWhereInput;
    limit?: number;
};
export type UserModuleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserModuleUpdateManyMutationInput, Prisma.UserModuleUncheckedUpdateManyInput>;
    where?: Prisma.UserModuleWhereInput;
    limit?: number;
    include?: Prisma.UserModuleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserModuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where: Prisma.UserModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserModuleCreateInput, Prisma.UserModuleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserModuleUpdateInput, Prisma.UserModuleUncheckedUpdateInput>;
};
export type UserModuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
    where: Prisma.UserModuleWhereUniqueInput;
};
export type UserModuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserModuleWhereInput;
    limit?: number;
};
export type UserModuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserModuleSelect<ExtArgs> | null;
    omit?: Prisma.UserModuleOmit<ExtArgs> | null;
    include?: Prisma.UserModuleInclude<ExtArgs> | null;
};
export {};
