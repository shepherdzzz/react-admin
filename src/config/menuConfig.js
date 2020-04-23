const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'icon-home',
        isPublic: true,
    },
    {
        title: '商品',
        key: '/products',
        icon: 'icon-appstore',
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: 'icon-unorderedlist',
            },
            {
                title: '商品管理',
                key: '/product',
                icon: 'icon-wrench',
            },
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'icon-user',
    },
    {
        title: '角色管理',
        key: '/role',
        icon: 'icon-safetycertificate',
    },
    {
        title: '图形图标',
        key: '/charts',
        icon: 'icon-areachart',
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: 'icon-barchart',
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: 'icon-linechart',
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: 'icon-piechart',
            }
        ]
    }
]

export default menuList