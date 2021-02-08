<template>
    <div style="padding: 10px;overflow: scroll; max-height: calc(100vh - 88px);">
        <div style="background: #fff; border-radius: 8px; padding: 20px;">
            <div class="query-c">
                查询：
                <Input search placeholder="请输入查询内容" style="width: auto" />
            </div>
            <br>
            <Table size="small" border :columns="columns7" :data="data6"></Table>
            <br>
            <Page :total="100" show-sizer show-elevator/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'auditTable',
    data() {
        return {
            loading: false,
            columns7: [
                {
                    title: 'Name',
                    key: 'name',
                    resizable: true,
                    width: 180,
                    render: (h, params) => h('div', [
                        h('Icon', {
                            props: {
                                type: 'person',
                            },
                        }),
                        h('strong', params.row.name),
                    ]),
                },
                {
                    title: 'Age',
                    key: 'age',
                    resizable: true,
                    width: 180,
                },
                {
                    title: 'Address',
                    key: 'address',
                },
                {
                    title: '审核',
                    key: 'action',
                    fixed: 'right',
                    width: 150,
                    align: 'center',
                    render: (h, params) => h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.show(params.index)
                                },
                            },
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.remove(params.index)
                                },
                            },
                        }, '通过'),
                    ]),
                },
            ],
            data6: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                },
            ],
        }
    },
    methods: {
        show(index) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`,
            })
        },
        remove(index) {
            this.data6.splice(index, 1)
        },
    },
}

</script>

<style scoped>

</style>
