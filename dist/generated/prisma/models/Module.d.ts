import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ModuleModel = runtime.Types.Result.DefaultSelection<Prisma.$ModulePayload>;
export type AggregateModule = {
    _count: ModuleCountAggregateOutputType | null;
    _avg: ModuleAvgAggregateOutputType | null;
    _sum: ModuleSumAggregateOutputType | null;
    _min: ModuleMinAggregateOutputType | null;
    _max: ModuleMaxAggregateOutputType | null;
};
export type ModuleAvgAggregateOutputType = {
    displayOrder: number | null;
};
export type ModuleSumAggregateOutputType = {
    displayOrder: number | null;
};
export type ModuleMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    label: string | null;
    icon: string | null;
    description: string | null;
    displayOrder: number | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ModuleMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    label: string | null;
    icon: string | null;
    description: string | null;
    displayOrder: number | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ModuleCountAggregateOutputType = {
    id: number;
    name: number;
    label: number;
    icon: number;
    description: number;
    displayOrder: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ModuleAvgAggregateInputType = {
    displayOrder?: true;
};
export type ModuleSumAggregateInputType = {
    displayOrder?: true;
};
export type ModuleMinAggregateInputType = {
    id?: true;
    name?: true;
    label?: true;
    icon?: true;
    description?: true;
    displayOrder?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ModuleMaxAggregateInputType = {
    id?: true;
    name?: true;
    label?: true;
    icon?: true;
    description?: true;
    displayOrder?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ModuleCountAggregateInputType = {
    id?: true;
    name?: true;
    label?: true;
    icon?: true;
    description?: true;
    displayOrder?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ModuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ModuleCountAggregateInputType;
    _avg?: ModuleAvgAggregateInputType;
    _sum?: ModuleSumAggregateInputType;
    _min?: ModuleMinAggregateInputType;
    _max?: ModuleMaxAggregateInputType;
};
export type GetModuleAggregateType<T extends ModuleAggregateArgs> = {
    [P in keyof T & keyof AggregateModule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateModule[P]> : Prisma.GetScalarType<T[P], AggregateModule[P]>;
};
export type ModuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithAggregationInput | Prisma.ModuleOrderByWithAggregationInput[];
    by: Prisma.ModuleScalarFieldEnum[] | Prisma.ModuleScalarFieldEnum;
    having?: Prisma.ModuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ModuleCountAggregateInputType | true;
    _avg?: ModuleAvgAggregateInputType;
    _sum?: ModuleSumAggregateInputType;
    _min?: ModuleMinAggregateInputType;
    _max?: ModuleMaxAggregateInputType;
};
export type ModuleGroupByOutputType = {
    id: string;
    name: string;
    label: string;
    icon: string;
    description: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: ModuleCountAggregateOutputType | null;
    _avg: ModuleAvgAggregateOutputType | null;
    _sum: ModuleSumAggregateOutputType | null;
    _min: ModuleMinAggregateOutputType | null;
    _max: ModuleMaxAggregateOutputType | null;
};
type GetModuleGroupByPayload<T extends ModuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ModuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ModuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ModuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ModuleGroupByOutputType[P]>;
}>>;
export type ModuleWhereInput = {
    AND?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    OR?: Prisma.ModuleWhereInput[];
    NOT?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    id?: Prisma.StringFilter<"Module"> | string;
    name?: Prisma.StringFilter<"Module"> | string;
    label?: Prisma.StringFilter<"Module"> | string;
    icon?: Prisma.StringFilter<"Module"> | string;
    description?: Prisma.StringNullableFilter<"Module"> | string | null;
    displayOrder?: Prisma.IntFilter<"Module"> | number;
    isActive?: Prisma.BoolFilter<"Module"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    users?: Prisma.UserModuleListRelationFilter;
};
export type ModuleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    icon?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    displayOrder?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    users?: Prisma.UserModuleOrderByRelationAggregateInput;
};
export type ModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    OR?: Prisma.ModuleWhereInput[];
    NOT?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    label?: Prisma.StringFilter<"Module"> | string;
    icon?: Prisma.StringFilter<"Module"> | string;
    description?: Prisma.StringNullableFilter<"Module"> | string | null;
    displayOrder?: Prisma.IntFilter<"Module"> | number;
    isActive?: Prisma.BoolFilter<"Module"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    users?: Prisma.UserModuleListRelationFilter;
}, "id" | "name">;
export type ModuleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    icon?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    displayOrder?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ModuleCountOrderByAggregateInput;
    _avg?: Prisma.ModuleAvgOrderByAggregateInput;
    _max?: Prisma.ModuleMaxOrderByAggregateInput;
    _min?: Prisma.ModuleMinOrderByAggregateInput;
    _sum?: Prisma.ModuleSumOrderByAggregateInput;
};
export type ModuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.ModuleScalarWhereWithAggregatesInput | Prisma.ModuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.ModuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ModuleScalarWhereWithAggregatesInput | Prisma.ModuleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    label?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    icon?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Module"> | string | null;
    displayOrder?: Prisma.IntWithAggregatesFilter<"Module"> | number;
    isActive?: Prisma.BoolWithAggregatesFilter<"Module"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Module"> | Date | string;
};
export type ModuleCreateInput = {
    id?: string;
    name: string;
    label: string;
    icon: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserModuleCreateNestedManyWithoutModuleInput;
};
export type ModuleUncheckedCreateInput = {
    id?: string;
    name: string;
    label: string;
    icon: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserModuleUncheckedCreateNestedManyWithoutModuleInput;
};
export type ModuleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    icon?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserModuleUpdateManyWithoutModuleNestedInput;
};
export type ModuleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    icon?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserModuleUncheckedUpdateManyWithoutModuleNestedInput;
};
export type ModuleCreateManyInput = {
    id?: string;
    name: string;
    label: string;
    icon: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ModuleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    icon?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    icon?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    icon?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    displayOrder?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ModuleAvgOrderByAggregateInput = {
    displayOrder?: Prisma.SortOrder;
};
export type ModuleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    icon?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    displayOrder?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ModuleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    icon?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    displayOrder?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ModuleSumOrderByAggregateInput = {
    displayOrder?: Prisma.SortOrder;
};
export type ModuleScalarRelationFilter = {
    is?: Prisma.ModuleWhereInput;
    isNot?: Prisma.ModuleWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ModuleCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutUsersInput, Prisma.ModuleUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutUsersInput;
    connect?: Prisma.ModuleWhereUniqueInput;
};
export type ModuleUpdateOneRequiredWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutUsersInput, Prisma.ModuleUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.ModuleUpsertWithoutUsersInput;
    connect?: Prisma.ModuleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutUsersInput, Prisma.ModuleUpdateWithoutUsersInput>, Prisma.ModuleUncheckedUpdateWithoutUsersInput>;
};
export type ModuleCreateWithoutUsersInput = {
    id?: string;
    name: string;
    label: string;
    icon: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ModuleUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    label: string;
    icon: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ModuleCreateOrConnectWithoutUsersInput = {
    where: Prisma.ModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutUsersInput, Prisma.ModuleUncheckedCreateWithoutUsersInput>;
};
export type ModuleUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.ModuleUpdateWithoutUsersInput, Prisma.ModuleUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutUsersInput, Prisma.ModuleUncheckedCreateWithoutUsersInput>;
    where?: Prisma.ModuleWhereInput;
};
export type ModuleUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.ModuleWhereInput;
    data: Prisma.XOR<Prisma.ModuleUpdateWithoutUsersInput, Prisma.ModuleUncheckedUpdateWithoutUsersInput>;
};
export type ModuleUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    icon?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    icon?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    displayOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleCountOutputType = {
    users: number;
};
export type ModuleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | ModuleCountOutputTypeCountUsersArgs;
};
export type ModuleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleCountOutputTypeSelect<ExtArgs> | null;
};
export type ModuleCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserModuleWhereInput;
};
export type ModuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    label?: boolean;
    icon?: boolean;
    description?: boolean;
    displayOrder?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    users?: boolean | Prisma.Module$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.ModuleCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["module"]>;
export type ModuleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    label?: boolean;
    icon?: boolean;
    description?: boolean;
    displayOrder?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["module"]>;
export type ModuleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    label?: boolean;
    icon?: boolean;
    description?: boolean;
    displayOrder?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["module"]>;
export type ModuleSelectScalar = {
    id?: boolean;
    name?: boolean;
    label?: boolean;
    icon?: boolean;
    description?: boolean;
    displayOrder?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ModuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "label" | "icon" | "description" | "displayOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["module"]>;
export type ModuleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Module$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.ModuleCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ModuleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ModuleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ModulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Module";
    objects: {
        users: Prisma.$UserModulePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        label: string;
        icon: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["module"]>;
    composites: {};
};
export type ModuleGetPayload<S extends boolean | null | undefined | ModuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ModulePayload, S>;
export type ModuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ModuleCountAggregateInputType | true;
};
export interface ModuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Module'];
        meta: {
            name: 'Module';
        };
    };
    findUnique<T extends ModuleFindUniqueArgs>(args: Prisma.SelectSubset<T, ModuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ModuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ModuleFindFirstArgs>(args?: Prisma.SelectSubset<T, ModuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ModuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ModuleFindManyArgs>(args?: Prisma.SelectSubset<T, ModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ModuleCreateArgs>(args: Prisma.SelectSubset<T, ModuleCreateArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ModuleCreateManyArgs>(args?: Prisma.SelectSubset<T, ModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ModuleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ModuleDeleteArgs>(args: Prisma.SelectSubset<T, ModuleDeleteArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ModuleUpdateArgs>(args: Prisma.SelectSubset<T, ModuleUpdateArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ModuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ModuleUpdateManyArgs>(args: Prisma.SelectSubset<T, ModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ModuleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ModuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ModuleUpsertArgs>(args: Prisma.SelectSubset<T, ModuleUpsertArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ModuleCountArgs>(args?: Prisma.Subset<T, ModuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ModuleCountAggregateOutputType> : number>;
    aggregate<T extends ModuleAggregateArgs>(args: Prisma.Subset<T, ModuleAggregateArgs>): Prisma.PrismaPromise<GetModuleAggregateType<T>>;
    groupBy<T extends ModuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ModuleGroupByArgs['orderBy'];
    } : {
        orderBy?: ModuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ModuleFieldRefs;
}
export interface Prisma__ModuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Module$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ModuleFieldRefs {
    readonly id: Prisma.FieldRef<"Module", 'String'>;
    readonly name: Prisma.FieldRef<"Module", 'String'>;
    readonly label: Prisma.FieldRef<"Module", 'String'>;
    readonly icon: Prisma.FieldRef<"Module", 'String'>;
    readonly description: Prisma.FieldRef<"Module", 'String'>;
    readonly displayOrder: Prisma.FieldRef<"Module", 'Int'>;
    readonly isActive: Prisma.FieldRef<"Module", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Module", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Module", 'DateTime'>;
}
export type ModuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[];
};
export type ModuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[];
};
export type ModuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[];
};
export type ModuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuleCreateInput, Prisma.ModuleUncheckedCreateInput>;
};
export type ModuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ModuleCreateManyInput | Prisma.ModuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ModuleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    data: Prisma.ModuleCreateManyInput | Prisma.ModuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ModuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuleUpdateInput, Prisma.ModuleUncheckedUpdateInput>;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ModuleUpdateManyMutationInput, Prisma.ModuleUncheckedUpdateManyInput>;
    where?: Prisma.ModuleWhereInput;
    limit?: number;
};
export type ModuleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuleUpdateManyMutationInput, Prisma.ModuleUncheckedUpdateManyInput>;
    where?: Prisma.ModuleWhereInput;
    limit?: number;
};
export type ModuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuleCreateInput, Prisma.ModuleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ModuleUpdateInput, Prisma.ModuleUncheckedUpdateInput>;
};
export type ModuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuleWhereInput;
    limit?: number;
};
export type Module$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ModuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
};
export {};
