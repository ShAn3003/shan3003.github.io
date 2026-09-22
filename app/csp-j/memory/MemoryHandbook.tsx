"use client";

import { useEffect, useMemo, useState } from "react";

type MemoryPoint = {
  id: string;
  category: string;
  title: string;
  must: string[];
  trap: string;
  mnemonic: string;
  question: string;
  answer: string;
  refs: string;
};

const categories = ["全部", "计算机基础", "C++ 语言", "数据结构", "算法与复杂度", "数学与编码"];

const points: MemoryPoint[] = [
  { id: "unit", category: "计算机基础", title: "位、字节与容量换算", must: ["1 Byte = 8 bit。", "1 KiB = 1024 B，1 MiB = 1024 KiB，1 GiB = 1024 MiB；试题常简写为 KB、MB、GB。", "未压缩位图大小 = 宽 × 高 × 每像素位数 ÷ 8 字节。"], trap: "网络速率常用 bit/s，文件大小常用 Byte；两者换算要除以或乘以 8。", mnemonic: "八位一字节，千零二十四进一级。", question: "一张 1024×768、24 位真彩色、未压缩图片约占多少 MiB？", answer: "1024×768×24÷8÷1024÷1024 = 2.25 MiB。", refs: "2019 Q3、2023 Q13、2024 Q1/Q5" },
  { id: "integer-range", category: "计算机基础", title: "整数范围与补码", must: ["n 位无符号整数范围：0 到 2ⁿ-1。", "常见补码有符号整数范围：-2ⁿ⁻¹ 到 2ⁿ⁻¹-1。", "32 位无符号最大值为 2³²-1；32 位有符号最大值为 2³¹-1。"], trap: "C++ 有符号整数溢出属于未定义行为；不要把它当成一定循环回绕。", mnemonic: "无符号全给数值；有符号拿一位当符号。", question: "8 位有符号整数与无符号整数的范围分别是什么？", answer: "有符号 -128～127；无符号 0～255。", refs: "2024 Q1、2025 Q1" },
  { id: "architecture", category: "计算机基础", title: "计算机组成与地址", must: ["冯·诺依曼体系通常包括运算器、控制器、存储器、输入设备、输出设备。", "CPU 主要由运算器和控制器组成。", "内存单元的唯一编号称为地址，地址本身不是其中存放的数据。"], trap: "编译器、操作系统属于软件，不属于 CPU 的硬件组成。", mnemonic: "运控存，输入出；CPU 取运控。", question: "内存单元的唯一编号叫什么？", answer: "地址。", refs: "2020 Q1" },
  { id: "system-software", category: "计算机基础", title: "操作系统与编译器", must: ["操作系统管理硬件资源并向应用程序提供运行环境。", "Windows、Linux、Android 是操作系统；HTML 是标记语言。", "编译器把源程序翻译成目标代码或机器可执行形式。"], trap: "编译器不是把低级语言翻译成高级语言，也不是负责重新排列源程序。", mnemonic: "系统管资源，编译做翻译。", question: "HTML、Linux、Android、Windows 中哪一个不是操作系统？", answer: "HTML。", refs: "2019 Q15、2020 Q2、2023 Q15、2024 Q10/Q15" },
  { id: "ascii-domain", category: "计算机基础", title: "字符编码、域名与奖项", must: ["ASCII 中数字、大小写英文字母各自连续排列，因此同组字符可做差值运算。", "常用国家和地区顶级域名中，中国为 .cn。", "图灵奖通常被称为计算机科学领域的重要奖项。"], trap: "不要把字符 '0' 的编码值和整数 0 混为一谈；'0' 到 '9' 可用减 '0' 转成数值。", mnemonic: "字符有编码，中国点 cn，计算机奖记图灵。", question: "表达式 '7'-'0' 的结果是多少？", answer: "整数 7。", refs: "2019 Q1/Q15、2024 Q8" },
  { id: "types", category: "C++ 语言", title: "基本类型与 sizeof", must: ["常见基本类型：bool、char、short、int、long、long long、float、double、long double、void。", "sizeof 的结果单位是字节，类型大小与实现有关；题目若明确 32 位 int，则为 4 字节。", "bool 只表示逻辑真值；0 转为 false，非 0 转为 true。"], trap: "不要在题目没有说明环境时死背 long、指针的字节数。", mnemonic: "题目给位数再换字节，没给环境不乱猜。", question: "32 位 int 的 sizeof 通常是多少？", answer: "4 Byte。", refs: "2019 Q3、2024 Q6" },
  { id: "const-ref", category: "C++ 语言", title: "const、引用与传参", must: ["const 对象初始化后不能通过该名字修改。", "引用必须绑定到有效对象或函数，常用 T& 表示左值引用。", "值传递修改形参不影响实参；引用传递修改形参可直接影响实参。"], trap: "引用不是一份独立副本；函数返回局部变量的引用会产生悬空问题。", mnemonic: "值传副本，引用同一人，const 不准改。", question: "void f(int& x){x++;} 调用 f(a) 后 a 是否改变？", answer: "改变，a 增加 1。", refs: "2023 Q1、2025 Q10" },
  { id: "operators", category: "C++ 语言", title: "运算符优先级速记", must: ["常用顺序：括号/下标 > 单目 > 乘除模 > 加减 > 移位 > 关系 > 相等 > 按位与 > 按位异或 > 按位或 > 逻辑与 > 逻辑或 > 条件 > 赋值。", "同优先级还要看结合方向；多数二元运算从左向右，赋值从右向左。", "拿不准时加括号，阅读题先按优先级画分组。"], trap: "按位 &、| 与逻辑 &&、|| 完全不同；逻辑运算结果为 bool 并具有短路特性。", mnemonic: "算术先，比较后；位在逻辑前，赋值最后走。", question: "a+b*c 中先计算什么？", answer: "先算 b*c，再与 a 相加。", refs: "2019 Q2、2020 Q3、2025 Q2/Q7" },
  { id: "bitwise", category: "C++ 语言", title: "位运算必背结论", must: ["x & (x-1) 会消去 x 最低位的一个 1。", "x & -x 常用于取得最低位的一个 1（基于常见补码表示）。", "左移一位在不溢出时相当于乘 2；右移无符号数一位相当于整除 2。", "异或满足 x^x=0、x^0=x，并具有交换律和结合律。"], trap: "有符号数移位、负数右移和溢出可能涉及实现规定或未定义行为，题目通常会限制范围。", mnemonic: "减一与自己，最低一清零；同数异或零。", question: "二进制 101100 与 101011 按位与的结果是什么？", answer: "101000。", refs: "2019 Q2、2021 Q16、2022 Q16、2025 Q2" },
  { id: "control", category: "C++ 语言", title: "循环与流程控制", must: ["for：初始化一次，然后判断条件、执行循环体、执行更新。", "while 先判断后执行；do-while 至少执行一次。", "break 跳出当前循环或 switch；continue 跳过本轮剩余语句。", "return 结束当前函数并可返回值。"], trap: "嵌套循环中的 break 只退出最内层循环。", mnemonic: "break 出圈，continue 下一圈，return 出函数。", question: "哪一种循环至少执行一次循环体？", answer: "do-while。", refs: "2019 Q4、2024 Q7" },
  { id: "string", category: "C++ 语言", title: "std::string 常用接口", must: ["s.size() 与 s.length() 都返回字符数量。", "下标从 0 开始；合法范围通常是 0 到 size()-1。", "s.substr(pos,len) 取子串；s.find(x) 未找到时返回 string::npos。", "+ 可拼接字符串，== 按内容比较。"], trap: "空字符串时 size()-1 可能发生无符号下溢；遍历常写 i < s.size()。", mnemonic: "长度 size，查找 find，截取 substr。", question: "长度为 n 的 string，最后一个字符的下标是多少？", answer: "n-1（前提是 n>0）。", refs: "2025 Q9" },
  { id: "stack-queue", category: "数据结构", title: "栈、队列与双端队列", must: ["栈：后进先出 LIFO，只在同一端压入和弹出。", "队列：先进先出 FIFO，一端入队、另一端出队。", "双端队列 deque：两端都能插入和删除。", "DFS 常配栈或递归；BFS 常配队列。"], trap: "判断出栈序列时，未入栈元素不能先出；栈顶以下元素不能越过栈顶。", mnemonic: "栈像叠盘后进先出，队列像排队先进先出。", question: "BFS 通常使用哪种数据结构？", answer: "队列。", refs: "2021 Q5、2022 Q2/Q5、2024 Q13、2025 Q15" },
  { id: "array-list", category: "数据结构", title: "数组与链表", must: ["数组元素通常连续存储，支持 O(1) 下标随机访问。", "链表结点不要求连续，访问第 k 个元素通常需要 O(k)。", "已知位置插入或删除时，链表主要修改指针；数组通常需要移动元素。"], trap: "链表插入删除 O(1) 的前提是已经拿到相应结点或位置；寻找位置仍可能是 O(n)。", mnemonic: "数组找得快，链表改得快；先找位置另算账。", question: "单链表能否用 O(1) 时间随机访问第 k 个元素？", answer: "通常不能，需要从头沿指针遍历，O(k)。", refs: "2019 Q6、2020 Q7、2022 Q4/Q11、2023 Q4" },
  { id: "tree-basic", category: "数据结构", title: "树的基本数量关系", must: ["非空树有 n 个结点时恰有 n-1 条边。", "结点的度是孩子数；树的度是所有结点度的最大值。", "叶结点度为 0。", "若根为第 1 层，只有根的树高度为 1；题目可能使用第 0 层定义，要先确认。"], trap: "结点的深度、高度、层数定义可能差 1，以题目定义为准。", mnemonic: "树结点 n，边总少一。", question: "一棵有 100 个结点的树有多少条边？", answer: "99 条。", refs: "2020 Q12、2023 Q5" },
  { id: "binary-tree", category: "数据结构", title: "满二叉树与完全二叉树", must: ["第 i 层最多有 2ⁱ⁻¹ 个结点（根为第 1 层）。", "高度 h 的二叉树最多有 2ʰ-1 个结点。", "满二叉树每一层都达到最大结点数。", "完全二叉树除最后一层外全满，最后一层从左到右连续。"], trap: "完全二叉树不等于满二叉树；完全二叉树允许最后一层不满。", mnemonic: "满树层层满，完全树只许末层右边空。", question: "高度为 5 的二叉树最多有多少个结点？", answer: "2⁵-1=31。", refs: "2019 Q8、2020 Q12、2021 Q8、2022 Q8、2025 Q14" },
  { id: "tree-array", category: "数据结构", title: "完全二叉树数组下标", must: ["若从 1 编号：结点 i 的左孩子 2i，右孩子 2i+1，父结点 floor(i/2)。", "若从 0 编号：左孩子 2i+1，右孩子 2i+2，父结点 floor((i-1)/2)。"], trap: "先确认数组从 0 还是从 1 开始，两个公式不能混用。", mnemonic: "一号根：左二倍，右多一；零号根：左右都多一。", question: "从 1 编号时，结点 7 的父结点编号是多少？", answer: "floor(7/2)=3。", refs: "2019 Q8、2022 Q8" },
  { id: "traversal", category: "数据结构", title: "二叉树遍历与重建", must: ["前序：根-左-右；中序：左-根-右；后序：左-右-根。", "层序遍历通常使用队列。", "结点值互异时，前序+中序或中序+后序可唯一确定二叉树。", "仅有前序+后序通常不能唯一确定普通二叉树。"], trap: "前序第一个是根，后序最后一个是根；必须借助中序确定左右子树范围。", mnemonic: "前根先，后根后，中根夹中间。", question: "后序遍历的根结点位于序列哪里？", answer: "最后一个位置。", refs: "2019 Q14、2020 Q11、2023 Q11、2024 Q12" },
  { id: "expression", category: "数据结构", title: "前缀、中缀与后缀表达式", must: ["中缀：运算符在两个操作数之间，需要优先级和括号。", "前缀：运算符在操作数之前，从右向左配对计算。", "后缀：运算符在操作数之后，从左向右用栈计算。", "后缀求值：遇操作数入栈，遇运算符弹出右操作数再弹出左操作数。"], trap: "减法和除法不能交换顺序；第一次弹出的是右操作数。", mnemonic: "后缀左到右，见数入栈，见符弹右再弹左。", question: "a*(b+c) 的后缀表达式是什么？", answer: "abc+*。", refs: "2021 Q9、2022 Q6、2023 Q8" },
  { id: "graph", category: "数据结构", title: "图的度数与存储", must: ["无向图度数和 = 2×边数。", "有向图入度和 = 出度和 = 边数。", "简单无向图 n 个顶点最多 n(n-1)/2 条边。", "邻接矩阵空间 O(n²)，无向图的矩阵关于主对角线对称。"], trap: "有向图每条边只贡献一次入度和与一次出度和；不要把单个和写成 2m。", mnemonic: "无向一边算两度；有向一进一出各算一。", question: "无向图有 12 条边，所有顶点度数和是多少？", answer: "24。", refs: "2020 Q8、2021 Q6/Q14、2022 Q9、2023 Q12、2024 Q11、2025 Q5" },
  { id: "growth", category: "算法与复杂度", title: "常见复杂度增长顺序", must: ["常见由快到慢：O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)。", "复杂度忽略常数倍和低阶项，例如 3n²+5n+7 是 O(n²)。", "竞赛通常关心最坏时间复杂度。"], trap: "循环层数只是线索；循环变量若每次翻倍，单层循环也可能是 O(log n)。", mnemonic: "常、对、线、线对、平方、立方、指数、阶乘。", question: "for(i=1;i<n;i*=2) 的迭代次数是什么量级？", answer: "O(log n)。", refs: "2019 Q5、2020 Q5、2024 Q9" },
  { id: "lower-bounds", category: "算法与复杂度", title: "比较次数常用结论", must: ["n 个数找最大值至少比较 n-1 次。", "折半查找成功或失败的最坏比较次数约为 floor(log₂n)+1。", "基于比较的通用排序最坏情况下需要 Ω(n log n) 次比较。"], trap: "二分查找要求有序且能随机访问；链表上不能直接获得数组式 O(log n) 查找。", mnemonic: "最大 n减1；二分取对数；比较排序 nlogn。", question: "在 100 个数中找最大值，最少比较多少次？", answer: "99 次。", refs: "2019 Q5、2021 Q4、2024 Q9" },
  { id: "sorting", category: "算法与复杂度", title: "排序算法性质表", must: ["冒泡：稳定，平均/最坏 O(n²)，交换次数等于逆序对数。", "插入：稳定，最坏 O(n²)，基本有序时较快。", "选择：通常不稳定，O(n²)。", "归并：稳定，O(n log n)，额外空间 O(n)。", "快速：通常不稳定，平均 O(n log n)，最坏 O(n²)。", "堆排序：不稳定，O(n log n)。", "计数排序：稳定实现可达 O(n+k)，但依赖值域。"], trap: "“快速排序一定 O(n log n)”是错的；稳定性描述的是相等关键字元素的相对顺序。", mnemonic: "冒插归计稳；选快堆不稳。", question: "快速排序的最坏时间复杂度是什么？", answer: "O(n²)。", refs: "2019 Q20、2020 Q5、2022 Q12、2025 Q12" },
  { id: "dfs-bfs", category: "算法与复杂度", title: "DFS 与 BFS", must: ["DFS 沿一条路深入后回溯，常用递归或栈。", "BFS 按距离层次扩展，常用队列；无权图最短路通常用 BFS。", "邻接表存图时，完整遍历时间复杂度通常为 O(V+E)。"], trap: "DFS 不保证无权图最短路；BFS 的“最短”前提是边权相同或无权。", mnemonic: "深搜一条走到底，广搜一层一层推。", question: "无权图中求单源最短路通常用什么？", answer: "BFS。", refs: "2021 Q14、2022 Q20" },
  { id: "recursion", category: "算法与复杂度", title: "递归三要素", must: ["递归必须有终止条件。", "每次调用应让问题规模向终止条件靠近。", "递归调用使用调用栈，深度过大可能栈溢出。", "分析递归先写参数变化，再画调用树或列递推式。"], trap: "“函数调用自己”只是形式；没有收敛的规模变化仍会死循环。", mnemonic: "有出口、会靠近、信任子问题。", question: "递归函数最不可缺少的结构是什么？", answer: "能被到达的终止条件。", refs: "2019 Q18/Q19、2021 Q13、2022 Q15/Q17、2024 Q18/Q20、2025 Q3" },
  { id: "base", category: "数学与编码", title: "进制转换", must: ["r 进制整数展开：各位数字乘 r 的对应幂再求和。", "十进制转 r 进制整数：不断除以 r 取余，余数逆序。", "二进制 3 位对应一位八进制，4 位对应一位十六进制。", "小数部分转目标进制可反复乘基数取整数部分。"], trap: "八进制数字只能是 0～7，十六进制 A～F 表示 10～15。", mnemonic: "整数除基倒取余，小数乘基顺取整；二三八，二四十六。", question: "二进制 111101₂ 转成十六进制是多少？", answer: "3D₁₆。", refs: "2020 Q9、2021 Q7、2022 Q13、2023 Q2/Q9、2024 Q2、2025 Q13" },
  { id: "mod", category: "数学与编码", title: "模运算", must: ["(a+b) mod m = ((a mod m)+(b mod m)) mod m。", "乘法也可分别取模；减法后常再加 m 防止负数。", "若状态数量有限，递推取模序列最终会出现循环。", "只有 gcd(a,m)=1 时，a 才有模 m 的乘法逆元。"], trap: "一般不能直接做除法取模；必须确认逆元存在。", mnemonic: "加减乘可先模，除法先问逆元。", question: "(17+25) mod 7 等于多少？", answer: "0。", refs: "2020 Q13、2025 Q8" },
  { id: "number-theory", category: "数学与编码", title: "素数、因数与最大公约数", must: ["素数是大于 1 且只有 1 和自身两个正因数的整数。", "试除判断 n 是否为素数只需检查到 floor(sqrt(n))。", "若 d|n，则 n/d 也是因数；完全平方数的 sqrt(n) 只计一次。", "欧几里得算法：gcd(a,b)=gcd(b,a mod b)。"], trap: "1 不是素数；枚举因数配对时要防止平方根重复。", mnemonic: "素数从二起，试除到根号；辗转相除求最大公约。", question: "为什么判断素数只需试除到 sqrt(n)？", answer: "若 n 有非平凡因数，则一对因数中至少有一个不超过 sqrt(n)。", refs: "2019 Q9/Q10、2020 Q19、2022 Q19、2023 Q18、2024 Q16/Q19、2025 Q16" },
  { id: "combinatorics", category: "数学与编码", title: "排列、组合与网格路径", must: ["排列 A(n,k)=n!/(n-k)!，考虑顺序。", "组合 C(n,k)=n!/[k!(n-k)!]，不考虑顺序。", "C(n,k)=C(n,n-k)。", "从 (0,0) 只向右走 a 步、向下走 b 步到终点，共 C(a+b,a) 条路径。", "捆绑法：要求若干对象相邻时，先视作一个整体排列，再排内部。"], trap: "先判断是否区分顺序；重复元素排列要除以各重复次数的阶乘。", mnemonic: "有序用排列，无序用组合；网格选哪几步向右。", question: "5 人中选 2 人组成不分顺序的小组，有多少种？", answer: "C(5,2)=10。", refs: "2020 Q10/Q14、2021 Q10/Q12、2023 Q14、2024 Q3/Q14、2025 Q6/Q11" },
  { id: "counting", category: "数学与编码", title: "抽屉原理与容斥", must: ["把 n 个物品放入 m 个盒子，至少有一个盒子不少于 ceil(n/m) 个物品。", "两集合容斥：|A∪B|=|A|+|B|-|A∩B|。", "三集合容斥：单集合之和 - 两两交集之和 + 三者交集。", "“至少/至多”问题常用补集：总数减去不符合条件的数。"], trap: "抽屉原理只保证存在性，不说明具体是哪一个盒子。", mnemonic: "先加单集，减去重复，两次减多了再加三交。", question: "13 张牌分成 4 种花色，至少有几张同花色？", answer: "ceil(13/4)=4 张。", refs: "2019 Q7/Q12/Q13、2023 Q6、2024 Q3" },
  { id: "huffman", category: "数学与编码", title: "Huffman 编码", must: ["每次选权值最小的两个结点合并，反复直到只剩根。", "带权路径长度 WPL = 所有叶结点权值×深度之和。", "Huffman 编码是前缀编码：任何字符编码都不是另一个字符编码的前缀。", "频率越高的字符通常越靠近根、编码越短。"], trap: "左右边取 0 或 1 可互换，因此具体编码未必唯一，但最优 WPL 相同。", mnemonic: "每次挑最小两棵合并，频率高的离根近。", question: "权值 1、2、3 第一次合并哪两个？", answer: "1 和 2。", refs: "2021 Q11、2022 Q7、2023 Q10、2025 Q4" },
  { id: "encoding", category: "数学与编码", title: "Gray Code 与 Base64", must: ["相邻 Gray Code 只有一位不同；二进制转 Gray Code 可用 g=b^(b>>1)。", "Base64 把二进制按 6 位一组映射成 64 个字符。", "3 个字节正好变成 4 个 Base64 字符；末尾不足时常用 = 填充。", "Base64 是编码而非加密，不能提供保密性。"], trap: "Base64 后数据通常变长约三分之一；不要把它当压缩算法。", mnemonic: "格雷相邻差一位；三字节变四字符。", question: "Base64 是加密算法吗？", answer: "不是，它是可逆的文本编码。", refs: "2021 Q17、2024 Q4" },
];

const sources = [
  { title: "CCF《全国青少年信息学奥林匹克系列竞赛大纲》", url: "https://www.noi.cn/upload/resources/file/2023/03/15/1fa58eac9c412e01ce3c89c761058a43.pdf" },
  { title: "cppreference：C++ 核心语言", url: "https://en.cppreference.com/w/cpp/language" },
  { title: "OI Wiki：复杂度简介", url: "https://oi-wiki.org/basic/complexity/" },
  { title: "OI Wiki：排序简介", url: "https://oi-wiki.org/basic/sort-intro/" },
  { title: "OI Wiki：数据结构", url: "https://oi-wiki.org/ds/" },
  { title: "OI Wiki：数学", url: "https://oi-wiki.org/math/" },
];

export function MemoryHandbook() {
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [learned, setLearned] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = window.localStorage.getItem("cspj-memory-progress");
    if (saved) setLearned(new Set(JSON.parse(saved)));
  }, []);

  const visible = useMemo(() => points.filter((point) => {
    const categoryMatch = category === "全部" || point.category === category;
    const haystack = `${point.title} ${point.must.join(" ")} ${point.trap} ${point.mnemonic}`.toLowerCase();
    return categoryMatch && haystack.includes(query.trim().toLowerCase());
  }), [category, query]);

  function toggleLearned(id: string) {
    const next = new Set(learned);
    if (next.has(id)) next.delete(id); else next.add(id);
    setLearned(next);
    window.localStorage.setItem("cspj-memory-progress", JSON.stringify([...next]));
  }

  return <div className="memory-handbook">
    <section className="memory-hero">
      <div><p className="eyebrow">CSP-J 第一轮 · 考前复习</p><h1>背诵手册</h1><p>只整理适合直接记忆的定义、公式和易错结论。算法设计题仍需通过代码跟踪与练习理解，不能只靠背口诀。</p><div className="memory-hero-links"><a href="/csp-j/">← 返回题目图谱</a><button type="button" onClick={() => window.print()}>打印手册</button></div></div>
      <div className="memory-progress"><strong>{learned.size}<small> / {points.length}</small></strong><span>已标记掌握</span><div><i style={{ width: `${learned.size / points.length * 100}%` }} /></div></div>
    </section>

    <section className="memory-method"><h2>建议使用方法</h2><ol><li><strong>先遮住答案</strong><span>只看标题，尝试口述结论。</span></li><li><strong>再做一分钟自测</strong><span>展开问题，写下答案后核对。</span></li><li><strong>最后回到真题</strong><span>根据历年题号定位原题，检验是否会用。</span></li></ol></section>

    <section className="memory-toolbar" aria-label="筛选背诵内容">
      <label><span>搜索考点</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：二叉树、复杂度、进制" /></label>
      <div>{categories.map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p>显示 {visible.length} / {points.length} 个考点</p>
    </section>

    <div className="memory-groups">
      {categories.slice(1).map((group) => {
        const groupPoints = visible.filter((point) => point.category === group);
        if (!groupPoints.length) return null;
        return <section key={group} className="memory-group">
          <header><p>{String(categories.indexOf(group)).padStart(2, "0")}</p><h2>{group}</h2><span>{groupPoints.length} 个考点</span></header>
          <div className="memory-grid">{groupPoints.map((point) => <article key={point.id} className={learned.has(point.id) ? "is-learned" : ""}>
            <div className="memory-card-top"><span>{point.category}</span><label><input type="checkbox" checked={learned.has(point.id)} onChange={() => toggleLearned(point.id)} /> 已掌握</label></div>
            <h3>{point.title}</h3>
            <h4>必背结论</h4><ul>{point.must.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="memory-trap"><strong>易错：</strong>{point.trap}</p>
            <p className="memory-mnemonic"><strong>记忆：</strong>{point.mnemonic}</p>
            <details><summary>一分钟自测</summary><p>{point.question}</p><div><strong>答案：</strong>{point.answer}</div></details>
            <footer>关联真题：{point.refs}</footer>
          </article>)}</div>
        </section>;
      })}
    </div>

    <section className="memory-sources"><div><p className="eyebrow">Sources</p><h2>校对与延伸资料</h2><p>手册按历年题目重新组织并用简洁语言归纳；标准定义与知识范围可沿以下资料继续核对。</p></div><ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<span>↗</span></a></li>)}</ul></section>
    <p className="memory-disclaimer">本手册用于复习，不代替 CCF 官方大纲与原题。类型大小、整数行为等实现相关问题，以题目给定环境和 C++ 标准规定为准。</p>
  </div>;
}
