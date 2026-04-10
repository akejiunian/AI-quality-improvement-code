const KnowledgeReview = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">校审库</h1>
                    <p class="page-desc">建立校审要点清单与常见错误案例库，明确质量红线与标准</p>
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

            <!-- Tab 1: 校审要点 -->
            <div v-show="activeTab === 0">
                <div class="grid-2">
                    <!-- Tree Panel -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">校审要点分类</span>
                            <button class="btn btn-primary btn-sm" @click="handleAddPoint">&#43; 新增要点</button>
                        </div>
                        <div class="card-body">
                            <div class="tree-list">
                                <div class="tree-node" v-for="(cat, cIndex) in reviewCategories" :key="cIndex">
                                    <div class="tree-node-header" @click="toggleTree(cIndex)">
                                        <span :class="['tree-node-arrow', { open: expandedNodes[cIndex] }]">&#9654;</span>
                                        <span class="tree-node-icon">{{ cat.icon }}</span>
                                        <span class="tree-node-title">{{ cat.name }}</span>
                                        <span class="tree-node-count">{{ cat.children.length }}</span>
                                    </div>
                                    <div class="tree-node-children" v-show="expandedNodes[cIndex]">
                                        <div class="tree-leaf" v-for="(leaf, lIndex) in cat.children" :key="lIndex"
                                             :style="{ background: selectedLeaf === cIndex + '-' + lIndex ? 'var(--primary-bg)' : '' }"
                                             @click="selectLeaf(cIndex, lIndex, leaf)">
                                            <span class="tree-leaf-icon">&#9679;</span>
                                            <span class="tree-leaf-title">{{ leaf.name }}</span>
                                            <span :class="['tag', 'tag-' + (leaf.importance === '高' ? 'red' : leaf.importance === '中' ? 'orange' : 'gray'), 'tree-leaf-tag']">{{ leaf.importance }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Detail Panel -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">要点详情</span>
                        </div>
                        <div class="card-body" v-if="selectedPoint">
                            <h3 style="font-size: 16px; font-weight: 600; color: var(--gray-800); margin-bottom: 12px;">{{ selectedPoint.name }}</h3>
                            <div style="margin-bottom: 16px;">
                                <span :class="['tag', 'tag-' + (selectedPoint.importance === '高' ? 'red' : selectedPoint.importance === '中' ? 'orange' : 'gray')]">重要程度：{{ selectedPoint.importance }}</span>
                                <span class="tag tag-blue" style="margin-left: 8px;">适用专业：{{ selectedPoint.major }}</span>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px;">检查依据</h4>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8; background: var(--gray-50); padding: 12px; border-radius: 6px;">{{ selectedPoint.basis }}</p>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px;">检查内容</h4>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8;">{{ selectedPoint.content }}</p>
                            </div>
                            <div>
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px;">常见问题</h4>
                                <ul style="padding-left: 16px; list-style: disc;">
                                    <li v-for="(issue, iIdx) in selectedPoint.issues" :key="iIdx" style="font-size: 13px; color: var(--gray-600); line-height: 1.8;">{{ issue }}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body" v-else>
                            <div class="empty-state">
                                <div class="empty-icon">&#128203;</div>
                                <div class="empty-text">请从左侧选择一个校审要点查看详情</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 错误案例 -->
            <div v-show="activeTab === 1">
                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="caseFilter.major" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option value="道路">道路</option>
                        <option value="桥梁">桥梁</option>
                        <option value="排水">排水</option>
                        <option value="规划">规划</option>
                        <option value="照明">照明</option>
                    </select>
                    <select class="form-select" v-model="caseFilter.type" style="min-width: 140px;">
                        <option value="">全部类型</option>
                        <option value="设计错误">设计错误</option>
                        <option value="计算错误">计算错误</option>
                        <option value="规范违反">规范违反</option>
                        <option value="制图错误">制图错误</option>
                    </select>
                    <select class="form-select" v-model="caseFilter.severity" style="min-width: 140px;">
                        <option value="">全部等级</option>
                        <option value="致命">致命</option>
                        <option value="严重">严重</option>
                        <option value="一般">一般</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索案例关键词..." v-model="caseFilter.search" style="min-width: 220px;">
                </div>

                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>案例编号</th>
                                <th>案例标题</th>
                                <th>专业</th>
                                <th>错误类型</th>
                                <th>严重等级</th>
                                <th>提交日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredCases" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.major }}</td>
                                <td><span :class="['tag', getTypeTagClass(item.type)]">{{ item.type }}</span></td>
                                <td><span :class="['tag', getSeverityTagClass(item.severity)]">{{ item.severity }}</span></td>
                                <td>{{ item.date }}</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleViewCase(item)">查看</button>
                                    <button class="btn btn-outline btn-sm">引用</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button :class="['page-btn', { active: true }]">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 3: 质量红线 -->
            <div v-show="activeTab === 2">
                <!-- Alert -->
                <div class="alert alert-danger" style="margin-bottom: 20px;">
                    <span style="font-size: 16px;">&#9888;</span>
                    <span>质量红线为规范强制性条文的汇集，所有设计必须严格遵守。违反强制性条文将触发系统预警并阻止流程推进。</span>
                </div>

                <!-- Major Quick Navigation -->
                <div class="redline-nav">
                    <div v-for="(major, mIdx) in redlineMajors" :key="major.name"
                         :class="['redline-nav-item', { active: redlineFilter.major === major.name }]"
                         @click="switchMajor(major.name)">
                        <span class="redline-nav-icon">{{ major.icon }}</span>
                        <span class="redline-nav-label">{{ major.name }}</span>
                        <span class="redline-nav-count">{{ major.count }}</span>
                    </div>
                </div>

                <!-- Filter & Search -->
                <div class="filter-bar">
                    <select class="form-select" v-model="redlineFilter.major" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option v-for="major in redlineMajors" :key="major.name" :value="major.name">{{ major.name }}</option>
                    </select>
                    <select class="form-select" v-model="redlineFilter.standard" style="min-width: 220px;">
                        <option value="">全部规范</option>
                        <option v-for="std in currentStandardOptions" :key="std" :value="std">{{ std }}</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索强制性条文内容..." v-model="redlineFilter.search" style="min-width: 260px;">
                    <div class="toolbar-right" style="margin-left: auto;">
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ filteredRedlines.length }} 条强制性条文</span>
                    </div>
                </div>

                <!-- Redline Clauses List -->
                <div v-if="filteredRedlines.length > 0">
                    <!-- Grouped by Standard -->
                    <div v-for="(group, gIdx) in groupedRedlines" :key="gIdx" style="margin-bottom: 24px;">
                        <!-- Standard Header -->
                        <div class="redline-standard-header">
                            <span class="redline-standard-icon">&#128214;</span>
                            <div class="redline-standard-info">
                                <span class="redline-standard-name">{{ group.standard }}</span>
                                <span class="redline-standard-meta">{{ filteredRedlines.filter(r => r.standard === group.standard).length }} 条强制性条文</span>
                            </div>
                            <button class="btn btn-ghost btn-sm" @click="toggleStandard(gIdx)" style="font-size: 12px;">
                                {{ expandedStandards[gIdx] ? '收起' : '展开' }}
                                <span :style="{ display: 'inline-block', transition: 'transform 0.2s', transform: expandedStandards[gIdx] ? 'rotate(90deg)' : 'rotate(0)' }">&#9654;</span>
                            </button>
                        </div>

                        <!-- Clause Items -->
                        <div v-show="expandedStandards[gIdx]">
                            <div v-for="(clause, cIdx) in group.clauses" :key="clause.id" class="redline-clause-card">
                                <div class="redline-clause-header" @click="toggleClause(clause.id)">
                                    <div class="redline-clause-left">
                                        <span class="redline-clause-badge">
                                            <span :class="['tag', getRedlineMajorTagClass(clause.major)]">{{ clause.major }}</span>
                                        </span>
                                        <span class="redline-clause-id">{{ clause.clauseNo }}</span>
                                        <span class="redline-clause-title">{{ clause.content }}</span>
                                    </div>
                                    <div class="redline-clause-right">
                                        <span :style="{ display: 'inline-block', transition: 'transform 0.2s', transform: expandedClauses[clause.id] ? 'rotate(90deg)' : 'rotate(0)', fontSize: '10px', color: 'var(--gray-400)' }">&#9654;</span>
                                    </div>
                                </div>
                                <div class="redline-clause-detail" v-show="expandedClauses[clause.id]">
                                    <div class="redline-clause-section">
                                        <div class="redline-clause-section-label">条文内容</div>
                                        <div class="redline-clause-section-body">{{ clause.content }}</div>
                                    </div>
                                    <div class="redline-clause-section">
                                        <div class="redline-clause-section-label">出处索引</div>
                                        <div class="redline-clause-section-body" style="background: var(--primary-bg); border-color: #bfdbfe;">
                                            <div class="redline-ref-item">
                                                <span class="redline-ref-label">规范标准：</span>
                                                <span class="redline-ref-value">{{ clause.standard }}</span>
                                            </div>
                                            <div class="redline-ref-item">
                                                <span class="redline-ref-label">章节编号：</span>
                                                <span class="redline-ref-value" style="font-weight: 600;">{{ clause.clauseNo }}</span>
                                            </div>
                                            <div v-if="clause.section" class="redline-ref-item">
                                                <span class="redline-ref-label">所属章节：</span>
                                                <span class="redline-ref-value">{{ clause.section }}</span>
                                            </div>
                                            <div v-if="clause.keyword" class="redline-ref-item">
                                                <span class="redline-ref-label">关键词：</span>
                                                <span class="redline-ref-value">
                                                    <span v-for="(kw, kwIdx) in clause.keyword" :key="kwIdx" class="tag tag-gray" style="margin-right: 4px; margin-bottom: 2px;">{{ kw }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="clause.checkPoints && clause.checkPoints.length > 0" class="redline-clause-section">
                                        <div class="redline-clause-section-label">校审要点</div>
                                        <ul class="redline-check-list">
                                            <li v-for="(cp, cpIdx) in clause.checkPoints" :key="cpIdx">{{ cp }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="card">
                    <div class="card-body">
                        <div class="empty-state">
                            <div class="empty-icon">&#128270;</div>
                            <div class="empty-text">未找到匹配的强制性条文，请调整筛选条件</div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="pagination" style="margin-top: 16px;">
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
            tabs: ['校审要点', '错误案例', '质量红线'],
            expandedNodes: {},
            selectedLeaf: null,
            selectedPoint: null,
            expandedStandards: {},
            expandedClauses: {},
            reviewCategories: [
                {
                    name: '通用校审要点', icon: '&#128736;', children: [
                        { name: '设计文件完整性检查', importance: '高', major: '通用', basis: '《建筑工程设计文件编制深度规定》', content: '检查设计文件是否包含封面、目录、设计说明、设计图纸、计算书等完整性内容，确认各部分文件之间的对应关系和一致性。', issues: ['缺少计算书附件', '目录与图纸内容不对应', '设计说明版本不一致'] },
                        { name: '图纸图签与编号规范', importance: '中', major: '通用', basis: '《市政工程设计文件编制深度规定》', content: '检查图纸标题栏信息是否完整，包括项目名称、图纸名称、设计阶段、图号、比例尺、日期、设计审核人员签字等。', issues: ['图签信息填写不全', '图纸编号不符合企业标准', '比例尺标注错误'] },
                        { name: '设计说明规范性审查', importance: '高', major: '通用', basis: '各专业设计文件编制深度要求', content: '审查设计说明内容是否完整、准确，包括工程概况、设计依据、设计参数、技术标准、主要材料等关键信息。', issues: ['引用已废止规范', '设计参数与图纸不符', '工程概况描述不完整'] }
                    ]
                },
                {
                    name: '道路专业', icon: '&#128739;', children: [
                        { name: '道路平面线形检查', importance: '高', major: '道路', basis: 'CJJ 37-2012 第5.2节', content: '检查道路平面线形设计是否符合规范要求，包括圆曲线半径、缓和曲线参数、平曲线最小长度、超高与加宽设置等。', issues: ['圆曲线半径小于极限值', '缓和曲线长度不足', '超高过渡段设置不合理'] },
                        { name: '纵断面设计校验', importance: '高', major: '道路', basis: 'CJJ 37-2012 第5.3节', content: '校验纵断面设计参数，包括纵坡坡度、坡长、竖曲线半径、竖曲线最小长度、凸凹竖曲线极限值等。', issues: ['最大纵坡超过规范限值', '坡长不满足要求', '竖曲线半径偏小'] },
                        { name: '横断面设计审查', importance: '中', major: '道路', basis: 'CJJ 37-2012 第5.4节', content: '审查横断面各组成部分宽度、路拱横坡、人行道设置、非机动车道布置等是否符合规范和规划要求。', issues: ['车道宽度不足', '人行道宽度不符合无障碍要求', '路拱坡度设置不当'] },
                        { name: '路面结构设计校核', importance: '高', major: '道路', basis: 'CJJ 169-2012', content: '校核路面结构层厚度、材料参数、弯沉值、抗滑性能等关键设计指标。', issues: ['面层厚度不满足最小要求', '基层材料选择不当', '未考虑交通量增长'] }
                    ]
                },
                {
                    name: '桥梁专业', icon: '&#127985;', children: [
                        { name: '桥梁荷载标准校验', importance: '高', major: '桥梁', basis: 'JTG D60-2015 第4章', content: '校验桥梁设计荷载取值是否正确，包括车道荷载、车辆荷载、人群荷载及荷载组合等。', issues: ['荷载等级选择错误', '荷载组合遗漏工况', '冲击系数计算错误'] },
                        { name: '结构计算书审核', importance: '高', major: '桥梁', basis: 'JTG D62-2004', content: '审核结构计算书的完整性、准确性，包括计算模型建立、边界条件设定、内力分析、配筋计算等。', issues: ['计算模型简化不合理', '边界条件设置错误', '配筋计算不满足要求'] }
                    ]
                },
                {
                    name: '排水专业', icon: '&#128167;', children: [
                        { name: '管道水力计算校核', importance: '高', major: '排水', basis: 'GB 50014-2021', content: '校核排水管道水力计算，包括流量计算、管径确定、流速校验、充满度检查、管道坡度等。', issues: ['设计流量偏小', '管道流速不满足自清要求', '充满度超过规范限值'] },
                        { name: '雨水排放系统检查', importance: '中', major: '排水', basis: 'GB 50014-2021', content: '检查雨水排放系统的完整性，包括雨水口布置、连接管、雨水管网、排出口等是否满足排水需求。', issues: ['雨水口间距偏大', '雨水管连接方式不当', '排出口标高设置不合理'] }
                    ]
                },
                {
                    name: '规划专业', icon: '&#127959;', children: [
                        { name: '规划指标合规性审查', importance: '高', major: '规划', basis: 'GB 50180-2018', content: '审查规划方案的各项技术指标是否符合控制性详细规划要求，包括容积率、建筑密度、绿地率、停车配建等。', issues: ['容积率超出上限', '建筑密度超标', '绿地率不满足要求'] }
                    ]
                },
                {
                    name: '照明专业', icon: '&#128161;', children: [
                        { name: '照明计算审核', importance: '中', major: '照明', basis: 'CJJ 45-2015', content: '审核照明计算书，包括平均照度、照度均匀度、眩光控制、功率密度等指标是否符合标准。', issues: ['平均照度不达标', '眩光控制不满足要求', '功率密度超标'] }
                    ]
                }
            ],
            caseFilter: {
                major: '',
                type: '',
                severity: '',
                search: ''
            },
            errorCases: [
                { id: 1, code: 'EC-2026-001', title: '道路纵坡超过规范允许最大值', major: '道路', type: '规范违反', severity: '致命', date: '2026-03-15' },
                { id: 2, code: 'EC-2026-002', title: '桥梁桩基承载力计算参数取值错误', major: '桥梁', type: '计算错误', severity: '致命', date: '2026-03-12' },
                { id: 3, code: 'EC-2026-003', title: '排水管道管径与计算书不一致', major: '排水', type: '设计错误', severity: '严重', date: '2026-03-10' },
                { id: 4, code: 'EC-2026-004', title: '道路平面交叉角度标注错误', major: '道路', type: '制图错误', severity: '一般', date: '2026-03-08' },
                { id: 5, code: 'EC-2026-005', title: '照明灯具选型未满足防护等级要求', major: '照明', type: '规范违反', severity: '严重', date: '2026-03-05' },
                { id: 6, code: 'EC-2026-006', title: '规划方案容积率超出控规上限', major: '规划', type: '规范违反', severity: '致命', date: '2026-03-02' }
            ],
            redlineFilter: {
                major: '',
                standard: '',
                search: ''
            },
            redlineMajors: [
                { name: '道路', icon: '&#128739;', count: 6 },
                { name: '桥梁', icon: '&#127985;', count: 5 },
                { name: '管线', icon: '&#128688;', count: 4 },
                { name: '通信', icon: '&#128246;', count: 3 },
                { name: '建筑', icon: '&#127970;', count: 4 },
                { name: '结构', icon: '&#128209;', count: 5 },
                { name: '给排水', icon: '&#128167;', count: 5 },
                { name: '暖通', icon: '&#10052;', count: 4 },
                { name: '电气', icon: '&#9889;', count: 6 }
            ],
            redlines: [
                // ========== 道路专业 ==========
                { id: 'RL-001', major: '道路', standard: 'CJJ 37-2012《城镇道路工程设计规范》', clauseNo: '第3.4.2条', section: '第3章 道路等级与设计速度', content: '道路设计应满足城市规划要求，符合城市总体规划及控制性详细规划确定的路线走向、红线宽度和控制标高。', keyword: ['城市规划', '红线宽度', '控制标高'], checkPoints: ['核对设计路线是否与规划一致', '检查红线宽度是否满足规划要求', '验证控制标高与周边地块的衔接'] },
                { id: 'RL-002', major: '道路', standard: 'CJJ 37-2012《城镇道路工程设计规范》', clauseNo: '第5.2.2条', section: '第5章 横断面', content: '机动车道宽度应根据设计车型、设计速度和交通组成确定。主干路单车道宽度不应小于3.5m，次干路不应小于3.25m，支路不应小于3.0m。', keyword: ['机动车道宽度', '车道宽度', '设计速度'], checkPoints: ['检查各等级道路车道宽度是否满足最小要求', '核对车道宽度与设计速度的匹配性'] },
                { id: 'RL-003', major: '道路', standard: 'CJJ 37-2012《城镇道路工程设计规范》', clauseNo: '第5.3.4条', section: '第5章 平面与纵断面', content: '道路最大纵坡应符合规范规定。设计速度为60km/h时最大纵坡不应大于5%，设计速度为40km/h时不应大于7%，设计速度为30km/h时不应大于8%。', keyword: ['最大纵坡', '设计速度', '纵坡限制'], checkPoints: ['检查纵坡是否超过对应设计速度的最大限值', '验证坡长是否满足最小坡长要求'] },
                { id: 'RL-004', major: '道路', standard: 'CJJ 37-2012《城镇道路工程设计规范》', clauseNo: '第5.4.2条', section: '第5章 平面与纵断面', content: '道路圆曲线最小半径应按设计速度计算确定，设超高的圆曲线最小半径不应小于规范规定值，不设超高的圆曲线最小半径不应小于规范规定的2倍。', keyword: ['圆曲线', '最小半径', '超高'], checkPoints: ['核对圆曲线半径是否满足设超高最小半径', '检查不设超高条件下的半径是否达标'] },
                { id: 'RL-005', major: '道路', standard: 'GB 50220-95《城市道路交通规划设计规范》', clauseNo: '第3.3.1条', section: '第3章 城市道路', content: '城市道路网规划应满足城市客货车流和人流的需要，合理组织城市交通。道路网密度、间距应符合规范规定。', keyword: ['道路网密度', '间距', '交通组织'], checkPoints: ['验证道路网密度是否满足规划要求', '检查道路间距与用地功能的匹配'] },
                { id: 'RL-006', major: '道路', standard: 'GB 50763-2012《无障碍设计规范》', clauseNo: '第4.1.1条', section: '第4章 城市道路', content: '城市道路应进行无障碍设计，并应符合下列规定：人行道应设置连续的盲道，盲道应避开检查井等障碍物；人行道在交叉路口应设置缘石坡道。', keyword: ['无障碍', '盲道', '缘石坡道'], checkPoints: ['检查盲道是否连续设置且避开障碍物', '核对缘石坡道的设置是否符合要求', '验证无障碍设施与周边环境的衔接'] },

                // ========== 桥梁专业 ==========
                { id: 'RL-007', major: '桥梁', standard: 'JTG D60-2015《公路桥涵设计通用规范》', clauseNo: '第4.1.2条', section: '第4章 作用', content: '公路桥涵结构设计应按承载能力极限状态和正常使用极限状态进行设计，并应同时满足构造和工艺方面的要求。', keyword: ['承载能力极限状态', '正常使用极限状态', '设计状态'], checkPoints: ['确认两种极限状态均已验算', '检查验算工况是否覆盖所有可能的不利组合'] },
                { id: 'RL-008', major: '桥梁', standard: 'JTG D60-2015《公路桥涵设计通用规范》', clauseNo: '第4.3.1条', section: '第4章 作用', content: '桥梁设计应根据结构设计基准期，按承载能力极限状态和正常使用极限状态分别进行作用效应组合，并取其最不利组合进行设计。', keyword: ['作用效应组合', '设计基准期', '最不利组合'], checkPoints: ['检查荷载组合是否完整无遗漏', '验证各组合工况下最不利效应的取值'] },
                { id: 'RL-009', major: '桥梁', standard: 'JTG D62-2004《公路钢筋混凝土及预应力混凝土桥涵设计规范》', clauseNo: '第5.2.1条', section: '第5章 持久状况承载能力极限状态计算', content: '受弯构件的正截面承载力计算中，混凝土受压区高度应符合x\u22640b的要求，其中0b为相对界限受压区高度，应根据钢筋强度等级确定。', keyword: ['受弯构件', '受压区高度', '相对界限'], checkPoints: ['检查受压区高度是否满足限值', '验证相对界限受压区高度取值是否正确'] },
                { id: 'RL-010', major: '桥梁', standard: 'JTG D62-2004《公路钢筋混凝土及预应力混凝土桥涵设计规范》', clauseNo: '第6.3.1条', section: '第6章 持久状况正常使用极限状态计算', content: '预应力混凝土构件在使用阶段的应力计算中，构件中预应力钢筋的拉应力应符合规范限值要求，且构件混凝土的法向压应力及主压应力不应超过相应限值。', keyword: ['预应力', '应力验算', '应力限值'], checkPoints: ['检查预应力钢筋拉应力是否超限', '验证混凝土法向压应力及主压应力是否满足要求'] },
                { id: 'RL-011', major: '桥梁', standard: 'CJJ 11-2011《城市桥梁设计规范》', clauseNo: '第8.1.1条', section: '第8章 桥梁细部构造及附属设施', content: '桥梁人行道宽度应根据通行人流量确定，人行道宽度不应小于0.75m；当专供非机动车通行时，宽度不应小于2.5m。', keyword: ['人行道宽度', '非机动车道', '桥面宽度'], checkPoints: ['检查人行道宽度是否满足最小要求', '验证非机动车道宽度是否达标'] },

                // ========== 管线专业 ==========
                { id: 'RL-012', major: '管线', standard: 'GB 50289-2016《城市工程管线综合规划规范》', clauseNo: '第2.2.1条', section: '第2章 地下管线', content: '城市工程管线的平面位置和竖向位置均应采用城市统一的坐标系统和高程系统。地下管线不应敷设在建筑物基础下方。', keyword: ['坐标系统', '高程系统', '管线避让'], checkPoints: ['核对管线坐标和高程系统的一致性', '检查管线是否避让了建筑物基础'] },
                { id: 'RL-013', major: '管线', standard: 'GB 50289-2016《城市工程管线综合规划规范》', clauseNo: '第2.2.12条', section: '第2章 地下管线', content: '工程管线在道路下的规划位置，应布置在人行道或非机动车道下面。电信电缆、给水输水、燃气输气等管线宜布置在道路两侧。', keyword: ['管线位置', '道路两侧', '人行道'], checkPoints: ['检查管线是否布置在人行道或非机动车道下', '验证各类管线的道路两侧分布是否合理'] },
                { id: 'RL-014', major: '管线', standard: 'GB 50289-2016《城市工程管线综合规划规范》', clauseNo: '第4.1.6条', section: '第4章 管线综合', content: '地下管线之间及其与建（构）筑物之间的最小水平净距和最小垂直净距应符合规范规定。', keyword: ['水平净距', '垂直净距', '安全距离'], checkPoints: ['检查管线间水平净距是否满足最小要求', '验证管线与建筑物间净距是否达标'] },
                { id: 'RL-015', major: '管线', standard: 'CJJ 1-2008《城镇道路工程施工与质量验收规范》', clauseNo: '第14.2.1条', section: '第14章 管线施工', content: '沟槽开挖时，槽底不得受水浸泡或受冻。槽底高程允许偏差不得超过规范规定值。管道基础应在原状土上或经处理后的地基上修筑。', keyword: ['沟槽开挖', '管道基础', '地基处理'], checkPoints: ['检查沟槽开挖深度的允许偏差', '验证管道基础的地基处理是否满足要求'] },

                // ========== 通信专业 ==========
                { id: 'RL-016', major: '通信', standard: 'GB 50635-2010《城镇道路工程施工与质量验收规范》(通信管道部分)', clauseNo: '第5.1.1条', section: '通信管道', content: '通信管道的埋深应符合规范要求。人行道下管道埋深不应小于0.5m，车行道下管道埋深不应小于0.7m。管道进入人孔处的基础顶部距人孔上覆底面不应小于0.3m。', keyword: ['管道埋深', '人孔', '通信管道'], checkPoints: ['检查管道埋深是否满足最小值要求', '验证人孔处的净空高度是否达标'] },
                { id: 'RL-017', major: '通信', standard: 'YD 5102-2010《通信线路工程设计规范》', clauseNo: '第6.2.1条', section: '第6章 管道线路', content: '通信管道的管孔内径应同时满足光缆、电缆的敷设要求，主干管道管孔内径不宜小于90mm，配线管道管孔内径不宜小于75mm。', keyword: ['管孔内径', '光缆', '电缆'], checkPoints: ['检查管孔内径是否满足最小值', '验证管径是否适配所选光缆/电缆规格'] },
                { id: 'RL-018', major: '通信', standard: 'GB/T 50311-2016《综合布线系统工程设计规范》', clauseNo: '第3.3.1条', section: '第3章 系统设计', content: '综合布线系统应根据工程项目的性质、功能、环境条件和近远期用户需求进行设计，并应考虑系统扩展和升级的灵活性。', keyword: ['综合布线', '扩展性', '系统设计'], checkPoints: ['检查布线系统是否考虑了远期扩展', '验证系统设计是否满足用户需求'] },

                // ========== 建筑专业 ==========
                { id: 'RL-019', major: '建筑', standard: 'GB 50016-2014（2018版）《建筑设计防火规范》', clauseNo: '第3.1.1条', section: '第3章 厂房和仓库', content: '生产的火灾危险性应根据生产中使用或产生的物质性质及其数量等因素划分，可分为甲、乙、丙、丁、戊类，并应符合表3.1.1的规定。', keyword: ['火灾危险性', '分类', '物质性质'], checkPoints: ['核对建筑火灾危险性分类是否正确', '验证分类依据是否充分'] },
                { id: 'RL-020', major: '建筑', standard: 'GB 50016-2014（2018版）《建筑设计防火规范》', clauseNo: '第5.3.1条', section: '第5章 民用建筑', content: '建筑物的耐火等级分为一、二、三、四级。不同耐火等级建筑的相应构件的燃烧性能和耐火极限不应低于规范规定。', keyword: ['耐火等级', '燃烧性能', '耐火极限'], checkPoints: ['检查建筑构件的耐火极限是否达标', '验证耐火等级与建筑分类的匹配性'] },
                { id: 'RL-021', major: '建筑', standard: 'GB 50016-2014（2018版）《建筑设计防火规范》', clauseNo: '第5.5.21条', section: '第5章 民用建筑 - 安全疏散', content: '公共建筑内每个防火分区或一个防火分区的每个楼层，其安全出口的数量应经计算确定，且不应少于2个。符合下列条件之一的公共建筑，可设置1个安全出口。', keyword: ['安全出口', '防火分区', '疏散'], checkPoints: ['检查安全出口数量是否满足要求', '验证疏散距离和宽度是否达标'] },
                { id: 'RL-022', major: '建筑', standard: 'GB 50763-2012《无障碍设计规范》', clauseNo: '第3.1.1条', section: '第3章 基本规定', content: '供残疾人、老年人等使用的各类建筑的无障碍设施均应按无障碍设计。无障碍设计应符合安全、适用、经济、美观的原则。', keyword: ['无障碍', '残疾人', '通用设计'], checkPoints: ['检查无障碍设施是否全覆盖', '验证无障碍入口、通道、卫生间设置是否合规'] },

                // ========== 结构专业 ==========
                { id: 'RL-023', major: '结构', standard: 'GB 50011-2010（2016版）《建筑抗震设计规范》', clauseNo: '第1.0.2条', section: '第1章 总则', content: '抗震设防烈度为6度及以上地区的建筑，必须进行抗震设计。', keyword: ['抗震设防', '烈度', '抗震设计'], checkPoints: ['确认项目所在地区抗震设防烈度', '验证抗震设计是否按规范要求执行'] },
                { id: 'RL-024', major: '结构', standard: 'GB 50011-2010（2016版）《建筑抗震设计规范》', clauseNo: '第3.4.1条', section: '第3章 抗震设计的基本要求', content: '建筑形体及其构件布置的平面、竖向不规则性，应按下列要求划分：存在不规则的建筑应按规范要求采取加强措施。', keyword: ['不规则性', '形体规则', '加强措施'], checkPoints: ['检查建筑形体是否存在不规则类型', '验证不规则结构的加强措施是否到位'] },
                { id: 'RL-025', major: '结构', standard: 'GB 50009-2012《建筑结构荷载规范》', clauseNo: '第3.1.2条', section: '第3章 荷载分类和荷载代表值', content: '建筑结构设计应根据使用过程中在结构上可能同时出现的荷载，按承载能力极限状态和正常使用极限状态分别进行荷载组合，并应取各自的最不利组合进行设计。', keyword: ['荷载组合', '承载能力', '荷载代表值'], checkPoints: ['检查荷载组合工况是否完整', '验证荷载取值和分项系数是否正确'] },
                { id: 'RL-026', major: '结构', standard: 'GB 50010-2010（2015版）《混凝土结构设计规范》', clauseNo: '第3.1.7条', section: '第3章 基本设计规定', content: '结构构件应根据承载能力极限状态及正常使用极限状态的要求，分别按下列规定进行计算和验算：承载力计算、稳定性验算、疲劳验算、变形验算、裂缝控制验算。', keyword: ['承载力', '稳定性', '裂缝控制'], checkPoints: ['确认各项计算和验算均已执行', '检查验算结果是否满足规范限值'] },
                { id: 'RL-027', major: '结构', standard: 'GB 50068-2018《建筑结构可靠性设计统一标准》', clauseNo: '第8.2.1条', section: '第8章 极限状态设计', content: '结构构件的承载力设计应采用下列极限状态设计表达式。重要性系数的取值应根据结构安全等级确定，安全等级为一级时不应小于1.1，二级时不应小于1.0，三级时不应小于0.9。', keyword: ['重要性系数', '安全等级', '承载力'], checkPoints: ['检查结构安全等级是否确定正确', '验证重要性系数取值是否匹配'] },

                // ========== 给排水专业 ==========
                { id: 'RL-028', major: '给排水', standard: 'GB 50015-2003（2009版）《建筑给水排水设计标准》', clauseNo: '第3.1.1条', section: '第3章 给水', content: '居住小区的室外给水设计流量应根据小区总体规划、用水定额、用水人数、用水时间等因素综合确定。给水管道的设计流量应满足最高日最大时用水量的要求。', keyword: ['设计流量', '用水定额', '最高日最大时'], checkPoints: ['核对用水定额取值是否合理', '验证设计流量计算是否正确'] },
                { id: 'RL-029', major: '给排水', standard: 'GB 50014-2021《室外排水设计标准》', clauseNo: '第3.1.1条', section: '第3章 设计流量和设计水质', content: '排水管渠的设计流量应按下列规定计算：雨水管渠设计流量按公式Q=\u03C8qF计算，其中\u03C8为径流系数，q为设计暴雨强度，F为汇水面积。', keyword: ['设计流量', '暴雨强度', '径流系数'], checkPoints: ['检查暴雨强度公式是否选自当地资料', '验证径流系数取值是否合理', '核对汇水面积计算是否准确'] },
                { id: 'RL-030', major: '给排水', standard: 'GB 50014-2021《室外排水设计标准》', clauseNo: '第4.2.4条', section: '第4章 排水管渠', content: '污水管道最小管径和最小设计坡度应符合规范规定：污水管最小管径为200mm时，最小设计坡度为0.4%；污水管最小管径为300mm时，最小设计坡度为0.3%。', keyword: ['最小管径', '最小坡度', '污水管道'], checkPoints: ['检查管径是否满足最小值', '验证管道坡度是否满足自清要求'] },
                { id: 'RL-031', major: '给排水', standard: 'GB 50014-2021《室外排水设计标准》', clauseNo: '第4.3.6条', section: '第4章 排水管渠', content: '污水管道在管径为200~300mm时，最大设计充满度应为0.55；管径为350~450mm时，最大设计充满度应为0.65；管径为500~900mm时，最大设计充满度应为0.70。', keyword: ['最大充满度', '管径', '设计标准'], checkPoints: ['检查管道充满度是否超过最大限值', '验证充满度与管径的匹配关系'] },
                { id: 'RL-032', major: '给排水', standard: 'GB 50015-2003（2009版）《建筑给水排水设计标准》', clauseNo: '第4.5.1条', section: '第4章 排水', content: '建筑排水管道的布置应符合下列要求：自卫生器具至排出管的距离应最短，管道转弯应最少；排水立管应靠近排水量最大的排水点。', keyword: ['排水管道', '管道布置', '排水立管'], checkPoints: ['检查排水管道布置是否最短路径', '验证排水立管位置是否合理'] },

                // ========== 暖通专业 ==========
                { id: 'RL-033', major: '暖通', standard: 'GB 50019-2015《工业建筑供暖通风与空气调节设计规范》', clauseNo: '第5.3.1条', section: '第5章 供暖', content: '集中供暖系统热媒的选择应根据建筑用途、所在地区气象条件、能源状况和环保要求等因素综合确定。民用建筑应采用热水作为热媒。', keyword: ['热媒选择', '集中供暖', '热水供暖'], checkPoints: ['检查热媒选择是否合理', '验证供暖系统设计是否符合地区要求'] },
                { id: 'RL-034', major: '暖通', standard: 'GB 50019-2015《工业建筑供暖通风与空气调节设计规范》', clauseNo: '第6.2.1条', section: '第6章 通风', content: '建筑物内的通风设计应保证室内空气品质满足卫生要求。当自然通风不能满足室内空气品质要求时，应设置机械通风系统。', keyword: ['通风设计', '空气品质', '机械通风'], checkPoints: ['检查自然通风是否满足要求', '验证机械通风系统的风量计算是否正确'] },
                { id: 'RL-035', major: '暖通', standard: 'GB 50016-2014（2018版）《建筑设计防火规范》', clauseNo: '第9.1.2条', section: '第9章 供暖、通风和空气调节', content: '甲、乙类厂房中的空气不应循环使用。含有燃烧或爆炸危险粉尘、纤维的丙类厂房中的空气，在循环使用前应经净化处理，并应使空气中的含尘浓度低于其爆炸下限的25%。', keyword: ['防爆通风', '空气循环', '粉尘浓度'], checkPoints: ['检查甲乙类厂房通风是否为直流式', '验证含尘空气处理是否满足防爆要求'] },
                { id: 'RL-036', major: '暖通', standard: 'GB 50243-2016《通风与空调工程施工质量验收规范》', clauseNo: '第4.2.1条', section: '第4章 风管制作', content: '风管的材质、厚度、连接方式及加固措施应符合设计要求和规范规定。防火风管的本体、框架与固定材料、密封垫料等必须为不燃材料。', keyword: ['防火风管', '不燃材料', '风管制作'], checkPoints: ['检查风管材料防火等级是否达标', '验证风管厚度是否满足规范要求'] },

                // ========== 电气专业 ==========
                { id: 'RL-037', major: '电气', standard: 'GB 50052-2009《供配电系统设计规范》', clauseNo: '第3.0.1条', section: '第3章 负荷分级及供电要求', content: '电力负荷应根据对供电可靠性的要求及中断供电所造成的损失或影响的程度分为一级、二级、三级负荷。一级负荷应由双重电源供电，当一电源发生故障时，另一电源不应同时受到损坏。', keyword: ['负荷分级', '双重电源', '供电可靠性'], checkPoints: ['确认负荷等级分类是否正确', '验证一级负荷的双电源供电方案', '检查备用电源切换时间是否满足要求'] },
                { id: 'RL-038', major: '电气', standard: 'GB 50052-2009《供配电系统设计规范》', clauseNo: '第3.0.9条', section: '第3章 负荷分级及供电要求', content: '备用电源的负荷严禁接入其他非重要负荷，一级负荷中特别重要的负荷除应由双重电源供电外，尚应增设应急电源，并严禁将其他负荷接入应急供电系统。', keyword: ['应急电源', '特别重要负荷', '备用电源'], checkPoints: ['检查应急电源是否独立设置', '验证应急供电系统是否混入其他负荷'] },
                { id: 'RL-039', major: '电气', standard: 'GB 50016-2014（2018版）《建筑设计防火规范》', clauseNo: '第10.1.1条', section: '第10章 电气', content: '消防用电设备应采用专用的供电回路，当建筑内的生产、生活用电被切断时，应仍能保证消防用电。消防配电设备应有明显标志。', keyword: ['消防供电', '专用回路', '消防配电'], checkPoints: ['检查消防用电是否采用专用供电回路', '验证消防配电设备是否有明显标志'] },
                { id: 'RL-040', major: '电气', standard: 'GB 50016-2014（2018版）《建筑设计防火规范》', clauseNo: '第10.3.1条', section: '第10章 电气', content: '除建筑高度小于27m的住宅建筑外，民用建筑、厂房和丙类仓库的下列部位应设置疏散照明：封闭楼梯间、防烟楼梯间及其前室、消防电梯间的前室或合用前室等。', keyword: ['疏散照明', '应急照明', '消防设施'], checkPoints: ['检查疏散照明设置位置是否完整', '验证应急照明照度和持续供电时间是否达标'] },
                { id: 'RL-041', major: '电气', standard: 'JGJ 16-2008《民用建筑电气设计规范》', clauseNo: '第12.2.1条', section: '第12章 接地和安全', content: '在 TN 系统中，配电变压器中性点应直接接地。所有电气设备的外露可导电部分应采用保护导体（PE线）与配电变压器中性点连接。', keyword: ['接地系统', '保护导体', '中性点接地'], checkPoints: ['检查接地系统形式是否合理', '验证PE线截面积是否满足规范要求'] },
                { id: 'RL-042', major: '电气', standard: 'GB 50057-2010《建筑物防雷设计规范》', clauseNo: '第3.0.3条', section: '第3章 建筑物的防雷分类', content: '在可能发生对地闪击的地区，遇下列情况之一时，应划为第二类防雷建筑物：预计雷击次数大于0.05次/年的部、省级办公建筑物和其他重要或人员密集的公共建筑物。', keyword: ['防雷分类', '雷击次数', '防雷措施'], checkPoints: ['核对防雷分类计算是否正确', '验证防雷措施是否满足对应类别要求'] }
            ]
        };
    },
    computed: {
        filteredCases() {
            return this.errorCases.filter(item => {
                if (this.caseFilter.major && item.major !== this.caseFilter.major) return false;
                if (this.caseFilter.type && item.type !== this.caseFilter.type) return false;
                if (this.caseFilter.severity && item.severity !== this.caseFilter.severity) return false;
                if (this.caseFilter.search) {
                    const keyword = this.caseFilter.search.toLowerCase();
                    return item.code.toLowerCase().includes(keyword) || item.title.includes(this.caseFilter.search);
                }
                return true;
            });
        },
        filteredRedlines() {
            return this.redlines.filter(item => {
                if (this.redlineFilter.major && item.major !== this.redlineFilter.major) return false;
                if (this.redlineFilter.standard && item.standard !== this.redlineFilter.standard) return false;
                if (this.redlineFilter.search) {
                    const keyword = this.redlineFilter.search.toLowerCase();
                    return item.content.toLowerCase().includes(keyword) ||
                           item.standard.toLowerCase().includes(keyword) ||
                           item.clauseNo.toLowerCase().includes(keyword) ||
                           item.section.toLowerCase().includes(keyword) ||
                           (item.keyword && item.keyword.some(kw => kw.includes(keyword)));
                }
                return true;
            });
        },
        currentStandardOptions() {
            let source = this.redlines;
            if (this.redlineFilter.major) {
                source = source.filter(r => r.major === this.redlineFilter.major);
            }
            const standards = [...new Set(source.map(r => r.standard))];
            return standards.sort();
        },
        groupedRedlines() {
            const groups = {};
            const list = this.filteredRedlines;
            for (const item of list) {
                if (!groups[item.standard]) {
                    groups[item.standard] = { standard: item.standard, clauses: [] };
                }
                groups[item.standard].clauses.push(item);
            }
            const result = Object.values(groups);
            // Auto-expand all groups initially
            result.forEach((_, idx) => {
                if (this.expandedStandards[idx] === undefined) {
                    this.expandedStandards[idx] = true;
                }
            });
            return result;
        },
        redlineMajorCounts() {
            const counts = {};
            for (const major of this.redlineMajors) {
                counts[major.name] = this.redlines.filter(r => r.major === major.name).length;
            }
            return counts;
        }
    },
    methods: {
        toggleTree(index) {
            this.expandedNodes = { ...this.expandedNodes, [index]: !this.expandedNodes[index] };
        },
        selectLeaf(catIndex, leafIndex, leaf) {
            this.selectedLeaf = catIndex + '-' + leafIndex;
            this.selectedPoint = leaf;
        },
        handleAddPoint() {
            alert('打开新增校审要点对话框');
        },
        getTypeTagClass(type) {
            const map = { '设计错误': 'tag-orange', '计算错误': 'tag-red', '规范违反': 'tag-red', '制图错误': 'tag-blue' };
            return map[type] || 'tag-gray';
        },
        getSeverityTagClass(severity) {
            const map = { '致命': 'tag-red', '严重': 'tag-orange', '一般': 'tag-gray' };
            return map[severity] || 'tag-gray';
        },
        handleViewCase(item) {
            alert('查看案例详情：' + item.code + ' ' + item.title);
        },
        switchMajor(majorName) {
            this.redlineFilter.major = this.redlineFilter.major === majorName ? '' : majorName;
            this.redlineFilter.standard = '';
        },
        getRedlineMajorTagClass(major) {
            const map = { '道路': 'tag-blue', '桥梁': 'tag-green', '管线': 'tag-purple', '通信': 'tag-orange', '建筑': 'tag-red', '结构': 'tag-blue', '给排水': 'tag-purple', '暖通': 'tag-orange', '电气': 'tag-red' };
            return map[major] || 'tag-gray';
        },
        toggleStandard(idx) {
            this.expandedStandards = { ...this.expandedStandards, [idx]: !this.expandedStandards[idx] };
        },
        toggleClause(clauseId) {
            this.expandedClauses = { ...this.expandedClauses, [clauseId]: !this.expandedClauses[clauseId] };
        }
    }
};

window.KnowledgeReview = KnowledgeReview;
