const KnowledgeTech = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">技术库</h1>
                    <p class="page-desc">整合所有技术规范与标准图集，构建标准化知识底座</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <div v-for="(tab, index) in tabs" :key="index"
                     :class="['tab-item', { active: activeTab === index }]"
                     @click="activeTab = index">
                    {{ tab }}
                </div>
            </div>

            <!-- Tab 1: 规范标准 -->
            <div v-show="activeTab === 0">
                <!-- Toolbar -->
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAdd">&#43; 新增规范</button>
                        <button class="btn btn-outline">&#8635; 同步更新</button>
                    </div>
                    <div class="toolbar-right">
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ standards.length }} 条记录</span>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="filterLevel" style="min-width: 140px;">
                        <option value="">全部级别</option>
                        <option value="国标">国标</option>
                        <option value="行标">行标</option>
                        <option value="地标">地标</option>
                        <option value="企标">企标</option>
                    </select>
                    <select class="form-select" v-model="filterMajor" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option value="道路">道路</option>
                        <option value="桥梁">桥梁</option>
                        <option value="排水">排水</option>
                        <option value="规划">规划</option>
                        <option value="照明">照明</option>
                    </select>
                    <select class="form-select" v-model="filterStatus" style="min-width: 140px;">
                        <option value="">全部状态</option>
                        <option value="现行">现行</option>
                        <option value="废止">废止</option>
                        <option value="即将实施">即将实施</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索标准编号或名称..." v-model="searchText" style="min-width: 220px;">
                </div>

                <!-- Table -->
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>标准编号</th>
                                <th>标准名称</th>
                                <th>级别</th>
                                <th>状态</th>
                                <th>适用专业</th>
                                <th>实施日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredStandards" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.level }}</td>
                                <td><span :class="['tag', getStatusTagClass(item.status)]">{{ item.status }}</span></td>
                                <td>{{ item.major }}</td>
                                <td>{{ item.date }}</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleView(item)">查看</button>
                                    <button class="btn btn-primary btn-sm" @click="handleDownload(item)">下载</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button v-for="p in 5" :key="p" :class="['page-btn', { active: p === 1 }]" @click="currentPage = p">{{ p }}</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 2: 标准图集 -->
            <div v-show="activeTab === 1">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAdd">&#43; 新增图集</button>
                    </div>
                    <div class="toolbar-right">
                        <input class="form-input" type="text" placeholder="搜索图集编号或名称..." v-model="atlasSearch" style="min-width: 220px;">
                    </div>
                </div>

                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>图集编号</th>
                                <th>图集名称</th>
                                <th>专业</th>
                                <th>版本</th>
                                <th>图幅数</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredAtlas" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td><span class="tag tag-blue">{{ item.major }}</span></td>
                                <td>{{ item.version }}</td>
                                <td>{{ item.sheets }} 幅</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleView(item)">查看</button>
                                    <button class="btn btn-primary btn-sm" @click="handleDownload(item)">下载</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button :class="['page-btn', { active: true }]">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

        </div>
    `,
    data() {
        return {
            activeTab: 0,
            tabs: ['规范标准', '标准图集'],
            currentPage: 1,
            filterLevel: '',
            filterMajor: '',
            filterStatus: '',
            searchText: '',
            atlasSearch: '',
            standards: [
                { id: 1, code: 'GB 50220-95', name: '城市道路交通规划设计规范', level: '国标', status: '现行', major: '道路', date: '1995-09-01' },
                { id: 2, code: 'CJJ 1-2008', name: '城镇道路工程技术标准', level: '行标', status: '现行', major: '道路', date: '2008-09-01' },
                { id: 3, code: 'GB 50014-2021', name: '室外排水设计标准', level: '国标', status: '现行', major: '排水', date: '2021-10-01' },
                { id: 4, code: 'CJJ 37-2012', name: '城市道路工程设计规范', level: '行标', status: '现行', major: '道路', date: '2012-05-01' },
                { id: 5, code: 'GB 50289-2016', name: '城市工程管线综合规划规范', level: '国标', status: '即将实施', major: '规划', date: '2016-12-01' },
                { id: 6, code: 'CJJ 45-2015', name: '城市道路照明设计标准', level: '行标', status: '现行', major: '照明', date: '2016-06-01' },
                { id: 7, code: 'JTG D60-2015', name: '公路桥涵设计通用规范', level: '行标', status: '废止', major: '桥梁', date: '2015-12-01' },
                { id: 8, code: 'GB 50763-2012', name: '无障碍设计规范', level: '国标', status: '现行', major: '道路', date: '2012-09-01' }
            ],
            atlases: [
                { id: 1, code: 'MR1', name: '城市道路-路面', major: '道路', version: '2012版', sheets: 186 },
                { id: 2, code: 'MR2', name: '城市道路-路基', major: '道路', version: '2008版', sheets: 124 },
                { id: 3, code: 'MS1', name: '给水排水标准图集', major: '排水', version: '2019版', sheets: 320 },
                { id: 4, code: 'MZ1', name: '城市道路照明', major: '照明', version: '2015版', sheets: 98 },
                { id: 5, code: 'MB1', name: '市政桥梁标准图集', major: '桥梁', version: '2020版', sheets: 256 },
                { id: 6, code: 'MR3', name: '道路交叉口设计图集', major: '道路', version: '2018版', sheets: 142 }
            ],
        };
    },
    computed: {
        filteredStandards() {
            return this.standards.filter(item => {
                if (this.filterLevel && item.level !== this.filterLevel) return false;
                if (this.filterMajor && item.major !== this.filterMajor) return false;
                if (this.filterStatus && item.status !== this.filterStatus) return false;
                if (this.searchText) {
                    const keyword = this.searchText.toLowerCase();
                    return item.code.toLowerCase().includes(keyword) || item.name.includes(this.searchText);
                }
                return true;
            });
        },
        filteredAtlas() {
            if (!this.atlasSearch) return this.atlases;
            const keyword = this.atlasSearch.toLowerCase();
            return this.atlases.filter(item =>
                item.code.toLowerCase().includes(keyword) || item.name.includes(this.atlasSearch)
            );
        }
    },
    methods: {
        getStatusTagClass(status) {
            const map = { '现行': 'tag-green', '废止': 'tag-red', '即将实施': 'tag-orange' };
            return map[status] || 'tag-gray';
        },
        handleAdd() {
            alert('打开新增规范对话框');
        },
        handleView(item) {
            alert('查看详情：' + item.code);
        },
        handleDownload(item) {
            alert('下载文件：' + item.code);
        },
    }
};

window.KnowledgeTech = KnowledgeTech;
