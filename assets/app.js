const TOKEN='tjean_menu_token';
const getToken=()=>localStorage.getItem(TOKEN)||'';
const api=async(url,opt={})=>{opt.headers={...(opt.headers||{}),...(getToken()?{'x-menu-token':getToken()}:{})};const r=await fetch(url,opt);const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Có lỗi xảy ra');return j};
const LANGS={vi:'Tiếng Việt',zh:'简体中文',zt:'繁體中文',th:'ไทย',ms:'Bahasa Melayu',en:'English'};
const LANGUAGE_KEY='tjean_language';
const legacy=localStorage.getItem('tjean_lang');
if(!localStorage.getItem(LANGUAGE_KEY)&&legacy)localStorage.setItem(LANGUAGE_KEY,legacy==='zht'?'zt':legacy);
const currentLanguage=()=>{const l=localStorage.getItem(LANGUAGE_KEY)||'vi';return LANGS[l]?l:'vi'};
const qs=k=>new URLSearchParams(location.search).get(k);
const translations={
'Công thức · TJean Menu+':['菜谱 · TJean Menu+','食譜 · TJean Menu+','สูตรอาหาร · TJean Menu+','Resipi · TJean Menu+','Recipes · TJean Menu+'],
'Chi tiết món · TJean Menu+':['菜谱详情 · TJean Menu+','食譜詳情 · TJean Menu+','รายละเอียดสูตร · TJean Menu+','Butiran resipi · TJean Menu+','Recipe details · TJean Menu+'],
'Menu+ của tôi · TJean':['我的 Menu+ · TJean','我的 Menu+ · TJean','Menu+ ของฉัน · TJean','Menu+ saya · TJean','My Menu+ · TJean'],
'Món mới · TJean Menu+':['新菜谱 · TJean Menu+','新食譜 · TJean Menu+','เมนูใหม่ · TJean Menu+','Resipi baru · TJean Menu+','New recipes · TJean Menu+'],
'Kích hoạt · TJean Menu+':['激活 · TJean Menu+','啟用 · TJean Menu+','เปิดใช้งาน · TJean Menu+','Aktifkan · TJean Menu+','Activate · TJean Menu+'],

'Khách':['访客','訪客','ผู้เยี่ยมชม','Tetamu','Guest'],
'100+ MÓN · CẬP NHẬT MỖI THÁNG':['100+道菜 · 每月更新','100+道菜 · 每月更新','100+ เมนู · อัปเดตทุกเดือน','100+ hidangan · Dikemas kini setiap bulan','100+ recipes · Updated monthly'],
'Một chiếc lò.':['一台烤箱。','一台烤箱。','เตาอบเครื่องเดียว','Satu ketuhar.','One oven.'],
'Trăm món ngon.':['百道美味。','百道美味。','อร่อยได้ร้อยเมนู','Seratus hidangan lazat.','A hundred delicious dishes.'],
'Menu thiết kế theo từng model TJean. Mua một lần, công thức tiếp tục được cập nhật.':['按 TJean 型号定制菜单。购买一次，菜谱持续更新。','依 TJean 型號設計菜單。購買一次，食譜持續更新。','เมนูออกแบบสำหรับเตา TJean แต่ละรุ่น ซื้อครั้งเดียว รับสูตรใหม่อย่างต่อเนื่อง','Menu direka untuk setiap model TJean. Beli sekali, resipi terus dikemas kini.','Menus tailored to each TJean model. Buy once and keep getting new recipes.'],
'Khám phá công thức →':['探索菜谱 →','探索食譜 →','สำรวจสูตรอาหาร →','Terokai resipi →','Explore recipes →'],
'Món nổi bật':['精选菜谱','精選食譜','เมนูแนะนำ','Menu pilihan','Featured recipes'],
'Chạm vào món để mở trang công thức riêng':['点击菜品查看详细菜谱','點選菜餚查看詳細食譜','แตะเมนูเพื่อดูสูตรอาหาร','Tekan hidangan untuk lihat resipi','Tap a dish to view its recipe'],
'MENU+ UPDATE · THÁNG NÀY':['MENU+ 更新 · 本月','MENU+ 更新 · 本月','MENU+ อัปเดต · เดือนนี้','KEMAS KINI MENU+ · BULAN INI','MENU+ UPDATE · THIS MONTH'],
'Món mới':['新菜谱','新食譜','เมนูใหม่','Menu baru','New recipes'],
'Công thức mới được cập nhật tự động cho chủ sở hữu.':['新菜谱自动更新给已激活用户。','新食譜自動更新給已啟用用戶。','สูตรใหม่อัปเดตอัตโนมัติสำหรับเจ้าของเครื่อง','Resipi baharu dikemas kini automatik untuk pemilik.','New recipes are added automatically for owners.'],
'Xem trang món mới →':['查看新菜谱 →','查看新食譜 →','ดูเมนูใหม่ →','Lihat menu baru →','View new recipes →'],
'Chọn lò của bạn':['选择你的烤箱','選擇你的烤箱','เลือกเตาอบของคุณ','Pilih ketuhar anda','Choose your oven'],
'Bạn đã mua TJean?':['已经购买 TJean？','已購買 TJean？','ซื้อ TJean แล้วใช่ไหม?','Sudah beli TJean?','Already own a TJean?'],
'Kích hoạt một lần để mở toàn bộ Menu+ của model bạn sở hữu.':['激活一次，即可解锁对应型号的全部 Menu+ 菜谱。','啟用一次，即可解鎖對應型號的全部 Menu+ 食譜。','เปิดใช้งานครั้งเดียวเพื่อดูสูตร Menu+ ทั้งหมดสำหรับรุ่นของคุณ','Aktifkan sekali untuk membuka semua resipi Menu+ bagi model anda.','Activate once to unlock all Menu+ recipes for your model.'],
'Kích hoạt Menu+ →':['激活 Menu+ →','啟用 Menu+ →','เปิดใช้งาน Menu+ →','Aktifkan Menu+ →','Activate Menu+ →'],
'Tìm món':['找菜谱','找食譜','ค้นหาเมนู','Cari resipi','Find recipes'],
'Của tôi':['我的','我的','ของฉัน','Akaun saya','My account'],
'Tất cả công thức':['全部菜谱','全部食譜','สูตรอาหารทั้งหมด','Semua resipi','All recipes'],
'Tìm món phù hợp với bữa ăn hôm nay':['找到适合今天的一餐','尋找適合今天的一餐','ค้นหาเมนูสำหรับมื้อวันนี้','Cari hidangan untuk hari ini','Find something to cook today'],
'Tìm món...':['搜索菜谱...','搜尋食譜...','ค้นหาเมนู...','Cari resipi...','Search recipes...'],
'Tất cả':['全部','全部','ทั้งหมด','Semua','All'],
'Món Việt':['越南菜','越南菜','อาหารเวียดนาม','Masakan Vietnam','Vietnamese'],
'Hấp':['蒸','蒸','นึ่ง','Kukus','Steam'],
'Nướng':['烤','烤','อบ','Bakar','Roast'],
'Làm bánh':['烘焙','烘焙','เบเกอรี','Bakeri','Bake'],
'Không tìm thấy món phù hợp':['没有找到匹配的菜谱','沒有找到符合的食譜','ไม่พบเมนูที่ตรงกัน','Tiada resipi sepadan','No matching recipes'],
'Không thể tải công thức':['无法加载菜谱','無法載入食譜','โหลดสูตรอาหารไม่ได้','Tidak dapat memuatkan resipi','Could not load recipes'],
'Quay lại':['返回','返回','ย้อนกลับ','Kembali','Back'],
'Đang tải...':['加载中...','載入中...','กำลังโหลด...','Memuatkan...','Loading...'],
'Không tìm thấy món':['未找到菜谱','找不到食譜','ไม่พบเมนู','Resipi tidak ditemui','Recipe not found'],
'Công thức dành cho chủ sở hữu':['专属菜谱','專屬食譜','สูตรสำหรับเจ้าของเครื่อง','Resipi untuk pemilik','Owner recipe'],
'Kích hoạt Menu+ để xem nguyên liệu, từng bước và thông số chính xác theo model của bạn.':['激活 Menu+，查看食材、步骤及对应型号参数。','啟用 Menu+，查看食材、步驟及對應型號參數。','เปิดใช้งาน Menu+ เพื่อดูวัตถุดิบ ขั้นตอน และค่าที่เหมาะกับรุ่นของคุณ','Aktifkan Menu+ untuk melihat bahan, langkah dan tetapan model anda.','Activate Menu+ to see ingredients, steps and settings for your model.'],
'Kích hoạt để xem →':['激活后查看 →','啟用後查看 →','เปิดใช้งานเพื่อดู →','Aktifkan untuk lihat →','Activate to view →'],
'Thông số':['参数','參數','การตั้งค่า','Tetapan','Settings'],
'Chế độ':['模式','模式','โหมด','Mod','Mode'],
'Nhiệt độ':['温度','溫度','อุณหภูมิ','Suhu','Temperature'],
'Thời gian':['时间','時間','เวลา','Masa','Time'],
'Vị trí':['摆放位置','擺放位置','ตำแหน่งถาด','Kedudukan rak','Rack position'],
'Món này chưa có thông số phù hợp với model đã kích hoạt.':['当前型号暂无适用参数。','目前型號尚無適用參數。','ยังไม่มีการตั้งค่าสำหรับรุ่นที่เปิดใช้งาน','Tetapan untuk model ini belum tersedia.','Settings for this model are not available yet.'],
'Nguyên liệu':['食材','食材','วัตถุดิบ','Bahan-bahan','Ingredients'],
'Cách làm':['做法','做法','วิธีทำ','Cara membuat','Method'],
'Thông số là điểm khởi đầu đã được chuẩn hóa; kích thước thực phẩm và nhiệt độ ban đầu có thể làm thời gian thay đổi nhẹ. Luôn kiểm tra thực phẩm đã chín an toàn trước khi dùng.':['参数仅供参考；食材尺寸和初始温度会影响烹饪时间。食用前务必确认熟透。','參數僅供參考；食材尺寸和初始溫度會影響烹調時間。食用前務必確認熟透。','การตั้งค่าเป็นค่าเริ่มต้น ขนาดและอุณหภูมิเริ่มต้นของอาหารอาจเปลี่ยนเวลาปรุง ตรวจสอบว่าอาหารสุกปลอดภัยก่อนรับประทาน','Tetapan ini ialah titik permulaan. Saiz dan suhu awal makanan mungkin mengubah masa. Pastikan makanan masak dengan selamat sebelum dimakan.','Settings are a starting point. Food size and starting temperature may change the time. Always check food is safely cooked before eating.'],
'Menu+ của tôi':['Menu+ 我的账户','我的 Menu+','Menu+ ของฉัน','Menu+ saya','My Menu+'],
'Đang kiểm tra...':['正在检查...','正在檢查...','กำลังตรวจสอบ...','Sedang menyemak...','Checking...'],
'ĐÃ KÍCH HOẠT':['已激活','已啟用','เปิดใช้งานแล้ว','DIAKTIFKAN','ACTIVATED'],
'Tài khoản:':['账户：','帳戶：','บัญชี:','Akaun:','Account:'],
'Xem Menu+ của tôi →':['查看我的 Menu+ →','查看我的 Menu+ →','ดู Menu+ ของฉัน →','Lihat Menu+ saya →','View my Menu+ →'],
'Đăng xuất trên thiết bị này':['在此设备退出登录','在此裝置登出','ออกจากระบบบนอุปกรณ์นี้','Log keluar pada peranti ini','Sign out on this device'],
'Chưa kích hoạt':['尚未激活','尚未啟用','ยังไม่เปิดใช้งาน','Belum diaktifkan','Not activated'],
'Kích hoạt mã trong hộp TJean để mở toàn bộ công thức theo model.':['使用 TJean 订单信息激活对应型号的全部菜谱。','使用 TJean 訂單資訊啟用對應型號的全部食譜。','ใช้ข้อมูลคำสั่งซื้อ TJean เพื่อเปิดสูตรทั้งหมดสำหรับรุ่นของคุณ','Gunakan butiran pesanan TJean untuk membuka semua resipi model anda.','Use your TJean order details to unlock recipes for your model.'],
'Kích hoạt ngay →':['立即激活 →','立即啟用 →','เปิดใช้งานตอนนี้ →','Aktifkan sekarang →','Activate now →'],
'Không thể kiểm tra trạng thái':['无法检查状态','無法檢查狀態','ตรวจสอบสถานะไม่ได้','Tidak dapat menyemak status','Could not check status'],
'Món mới mỗi tháng':['每月新菜谱','每月新食譜','เมนูใหม่ทุกเดือน','Resipi baharu setiap bulan','New recipes every month'],
'Mỗi lần cập nhật đều được lưu lại. Chọn một tháng để xem các món mới.':['保留每次更新记录。选择月份查看新菜谱。','保留每次更新記錄。選擇月份查看新食譜。','บันทึกทุกการอัปเดต เลือกเดือนเพื่อดูเมนูใหม่','Setiap kemas kini disimpan. Pilih bulan untuk melihat resipi baharu.','Every update is saved. Choose a month to see new recipes.'],
'MỚI NHẤT':['最新','最新','ล่าสุด','TERKINI','LATEST'],
'ARCHIVE':['归档','封存','เก่า','ARKIB','ARCHIVE'],
'Xem →':['查看 →','查看 →','ดู →','Lihat →','View →'],
'Chưa có bản cập nhật':['暂无更新','暫無更新','ยังไม่มีอัปเดต','Tiada kemas kini lagi','No updates yet'],
'Không thể tải lịch sử cập nhật':['无法加载更新记录','無法載入更新記錄','โหลดประวัติอัปเดตไม่ได้','Tidak dapat memuatkan sejarah kemas kini','Could not load update history'],
'Cập nhật':['更新','更新','อัปเดต','Kemas kini','Updates'],
'Chạm vào món để mở trang chi tiết.':['点击菜品查看详情。','點選菜餚查看詳情。','แตะเมนูเพื่อดูรายละเอียด','Tekan hidangan untuk lihat butiran.','Tap a dish for details.'],
'Chưa có món mới':['暂无新菜谱','暫無新食譜','ยังไม่มีเมนูใหม่','Tiada resipi baharu','No new recipes'],
'Không thể tải món mới':['无法加载新菜谱','無法載入新食譜','โหลดเมนูใหม่ไม่ได้','Tidak dapat memuatkan resipi baharu','Could not load new recipes'],
'Kích hoạt':['激活','啟用','เปิดใช้งาน','Aktifkan','Activate'],
'Mở khóa Menu+':['解锁 Menu+','解鎖 Menu+','ปลดล็อก Menu+','Buka Menu+','Unlock Menu+'],
'Chọn nơi bạn mua hàng và nhập mã đơn hàng TJean. Hệ thống sẽ tự nhận diện model lò và mở khóa Menu+ tương ứng.':['选择购买平台并输入 TJean 订单号，系统会识别烤箱型号并解锁对应 Menu+。','選擇購買平台並輸入 TJean 訂單號，系統會識別烤箱型號並解鎖對應 Menu+。','เลือกช่องทางซื้อและกรอกเลขคำสั่งซื้อ TJean ระบบจะระบุรุ่นและปลดล็อก Menu+','Pilih platform pembelian dan masukkan nombor pesanan TJean. Sistem akan mengenal pasti model anda dan membuka Menu+.','Select where you bought it and enter your TJean order number. We will identify your oven model and unlock its Menu+.'],
'Bạn mua hàng ở đâu?':['在哪里购买？','在哪裡購買？','ซื้อจากที่ไหน?','Di mana anda membeli?','Where did you buy it?'],
'Email hoặc số điện thoại':['邮箱或电话号码','電郵或電話號碼','อีเมลหรือเบอร์โทรศัพท์','E-mel atau nombor telefon','Email or phone number'],
'Mã đơn hàng':['订单号','訂單號','เลขคำสั่งซื้อ','Nombor pesanan','Order number'],
'Kích hoạt Menu+':['激活 Menu+','啟用 Menu+','เปิดใช้งาน Menu+','Aktifkan Menu+','Activate Menu+'],
'Mỗi đơn hàng chỉ có thể liên kết với một tài khoản Menu+. Nếu đổi điện thoại, hãy dùng lại đúng thông tin tài khoản và mã đơn hàng đã kích hoạt.':['每个订单只能绑定一个 Menu+ 账户。更换手机时，请使用原账户信息和订单号。','每筆訂單只能綁定一個 Menu+ 帳戶。更換手機時，請使用原帳戶資訊和訂單號。','แต่ละคำสั่งซื้อผูกกับบัญชี Menu+ ได้หนึ่งบัญชี หากเปลี่ยนโทรศัพท์ ให้ใช้ข้อมูลบัญชีและเลขคำสั่งซื้อเดิม','Setiap pesanan hanya boleh dipautkan pada satu akaun Menu+. Jika bertukar telefon, gunakan maklumat akaun dan nombor pesanan yang sama.','Each order links to one Menu+ account. If you change phones, use the same account details and order number.'],
'Đang xác minh đơn hàng...':['正在验证订单...','正在驗證訂單...','กำลังตรวจสอบคำสั่งซื้อ...','Sedang mengesahkan pesanan...','Verifying order...'],
'Kích hoạt thành công':['激活成功','啟用成功','เปิดใช้งานสำเร็จ','Berjaya diaktifkan','Activated successfully'],
'Chưa có món':['暂无菜谱','暫無食譜','ยังไม่มีเมนู','Tiada resipi lagi','No recipes yet'],
'Đang cập nhật Menu+':['正在更新 Menu+','正在更新 Menu+','กำลังอัปเดต Menu+','Menu+ sedang dikemas kini','Menu+ is being updated'],
'Có lỗi xảy ra':['发生错误','發生錯誤','เกิดข้อผิดพลาด','Ralat berlaku','Something went wrong']
};
const langIndex={zh:0,zt:1,th:2,ms:3,en:4};
function tr(v){const lang=currentLanguage();if(lang==='vi')return v;const i=langIndex[lang],raw=v.trim();if(translations[raw])return translations[raw][i];let m=raw.match(/^\+(\d+) món mới$/);if(m)return '+'+m[1]+' '+translations['Món mới'][i];m=raw.match(/^\+(\d+) món$/);if(m)return '+'+m[1]+' '+({zh:'道菜',zt:'道菜',th:'เมนู',ms:'resipi',en:'recipes'}[lang]);for(const key of ['Món mới','Thông số','Tài khoản:','Kích hoạt thành công'])if(raw.startsWith(key+' · ')||raw.startsWith(key+' ')){return raw.replace(key,translations[key][i])}return v}
function translateTree(root){const lang=currentLanguage();document.documentElement.lang=lang==='zt'?'zh-Hant':lang==='zh'?'zh-Hans':lang;document.title=tr(document.title);const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&['SCRIPT','STYLE','TEXTAREA'].includes(n.parentElement.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});let n;while(n=walker.nextNode()){const v=n.nodeValue, translated=tr(v);if(translated!==v)n.nodeValue=v.replace(v.trim(),translated)}if(root.querySelectorAll)root.querySelectorAll('[placeholder]').forEach(e=>e.placeholder=tr(e.placeholder))}
function languageSwitcher(){const header=document.querySelector('.top');if(!header)return;const wrap=document.createElement('div');wrap.className='lang-wrap';const selected=currentLanguage();const button=document.createElement('button');button.className='lang-btn';button.type='button';button.setAttribute('aria-label',LANGS[selected]);button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9"/></svg><span class="lang-label"></span><span class="chevron" aria-hidden="true">▾</span>';button.querySelector('.lang-label').textContent=LANGS[selected];const menu=document.createElement('div');menu.className='lang-menu';for(const [code,label] of Object.entries(LANGS)){const item=document.createElement('button');item.type='button';item.textContent=label;item.setAttribute('aria-selected',String(code===selected));if(code===selected)item.classList.add('selected');item.onclick=()=>{localStorage.setItem(LANGUAGE_KEY,code);localStorage.setItem('tjean_lang',code);location.reload()};menu.append(item)}button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');menu.setAttribute('role','listbox');button.onclick=()=>{const open=menu.classList.toggle('show');button.setAttribute('aria-expanded',String(open))};wrap.append(button,menu);header.append(wrap);document.addEventListener('click',e=>{if(!wrap.contains(e.target)){menu.classList.remove('show');button.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('show');button.setAttribute('aria-expanded','false');button.focus()}})}
function initLanguage(){translateTree(document.body);languageSwitcher();let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;translateTree(document.body)})}).observe(document.body,{childList:true,subtree:true,characterData:true})}
async function paintOwner(){const el=document.querySelector('[data-owner]');if(!el)return;try{const m=await api('/api/me');el.textContent=m.active?m.model:'Khách'}catch{el.textContent='Khách'}}
function card(r){return `<a class="card" href="/recipe/?slug=${encodeURIComponent(r.slug)}">${r.locked?'<span class="lock">🔒 Menu+</span>':''}<div class="photo">${r.emoji||'🍽️'}</div><div class="ct"><b>${r.name}</b><div class="tag">${r.people||''}${r.update_month?' · '+r.update_month:''}</div></div></a>`}
initLanguage();paintOwner();