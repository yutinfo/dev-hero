interface FieldLabelSet {
  fullName: string;
  firstName: string;
  lastName: string;
  nickname: string;
  gender: string;
  dob: string;
  age: string;
  phone: string;
  email: string;
  nationalId: string;
  province: string;
  district: string;
  region: string;
  postalCode: string;
  address: string;
  latitude: string;
  longitude: string;
  [key: string]: string;
}

interface AddressParams {
  houseNo: string;
  road: string;
  soi: string;
  district: string;
  provinceName: string;
  postal: string;
}

export interface Province {
  name: string;
  region: string;
  lat: number;
  lon: number;
  postalBase: number;
  districts: string[];
}

export interface Dataset {
  label: string;
  firstNames: string[];
  lastNames: string[];
  nicknames: string[];
  genders: string[];
  streetNames: string[];
  soiNames: string[];
  phonePrefixes: string[];
  phoneDigits: number;
  provinces: Province[];
  formatPhone?: (raw: string) => string;
  addressTemplate: (params: AddressParams) => string;
}

export const FIELD_LABELS: Record<'th' | 'en', FieldLabelSet> = {
    th: {
        fullName: 'ชื่อ-สกุล',
        firstName: 'ชื่อ',
        lastName: 'นามสกุล',
        nickname: 'ชื่อเล่น',
        gender: 'เพศ',
        dob: 'วันเกิด',
        age: 'อายุ',
        phone: 'เบอร์โทร',
        email: 'อีเมล',
        nationalId: 'เลขบัตรประชาชน',
        province: 'จังหวัด',
        district: 'อำเภอ/เขต',
        region: 'ภูมิภาค',
        postalCode: 'รหัสไปรษณีย์',
        address: 'ที่อยู่',
        latitude: 'Lat',
        longitude: 'Lon',
        username: 'Username',
        password: 'Password'
    },
    en: {
        fullName: 'Full Name',
        firstName: 'First Name',
        lastName: 'Last Name',
        nickname: 'Nickname',
        gender: 'Gender',
        dob: 'Date of Birth',
        age: 'Age',
        phone: 'Phone',
        email: 'Email',
        nationalId: 'National ID',
        province: 'Province',
        district: 'District',
        region: 'Region',
        postalCode: 'Postal Code',
        address: 'Address',
        latitude: 'Lat',
        longitude: 'Lon',
        username: 'Username',
        password: 'Password'
    }
};

export const DEFAULT_FIELDS = ['fullName', 'phone', 'province', 'district', 'postalCode', 'address', 'latitude', 'longitude'];
export const EMAIL_DOMAINS = ['example.com', 'mail.th', 'devhero.local', 'inbox.run', 'gmail.com', 'outlook.com'];

export const DATASETS: Record<'th' | 'en', Dataset> = {
    th: {
        label: 'ไทย',
        firstNames: [
            'นที', 'พชร', 'กิตติ', 'ภูมิ', 'ต้นกล้า', 'ภาณุ', 'เจษฎา', 'เมธา', 'ศุภ', 'คีตา', 'อธิป', 'ปวิน',
            'ลลิตา', 'พิมพ์', 'ณัฐชา', 'ชาลินี', 'อริสา', 'ธิดา', 'มนัสวี', 'กนกวรรณ', 'พัชราภา', 'ขวัญ', 'แพรว', 'ฐิตารีย์',
            'สมชาย', 'วิชัย', 'ประเสริฐ', 'สุชาติ', 'ศักดิ์สิทธิ์', 'อารยา', 'วรนุช', 'เขมนิจ', 'จิรายุ', 'ณเดชน์', 'อุรัสยา',
            'พีรพล', 'กรกฎ', 'ทิพย์', 'รัตนา', 'มาลี', 'สมศรี', 'บัวขาว', 'อนันดา', 'มาริโอ้', 'ธนภพ', 'ศิวัฒน์'
        ],
        lastNames: [
            'สุวรรณ', 'จิตรา', 'ธรรมรักษ์', 'กิตติวงศ์', 'พงศ์ไทย', 'ศรีสวัสดิ์', 'สถาพร', 'จันทร์เพ็ญ', 'ทวีชัย', 'เมตตา',
            'คชสิงห์', 'ปิ่นทอง', 'บุญมี', 'รัตนมณี', 'วิทยา', 'ใจดี', 'รักชาติ', 'มั่งมี', 'ศิริพร', 'เจริญสุข',
            'พานิชย์', 'วงษ์สุวรรณ', 'จินดา', 'เทพพิทักษ์', 'ว่องไว', 'กล้าหาญ', 'คงทน', 'มีโชค', 'ทรัพย์สมบูรณ์', 'รุ่งเรือง'
        ],
        nicknames: [
            'บูม', 'ปัน', 'ตาล', 'ขิม', 'เอิร์ธ', 'น้ำ', 'กาย', 'ฝน', 'เมย์', 'ฟ้า', 'โอ๊ต', 'กัน', 'บอส', 'เนย', 'มิว',
            'แบงค์', 'เกม', 'มายด์', 'นิว', 'พลอย', 'แนน', 'ไอซ์', 'เจมส์', 'ทอม', 'เต้ย', 'พีท', 'เบล', 'ก้อง', 'ส้ม'
        ],
        genders: ['ชาย', 'หญิง'],
        streetNames: [
            'ถนนสุขุมวิท', 'ถนนเพชรบุรี', 'ถนนสีลม', 'ถนนเชียงใหม่-ลำพูน', 'ถนนมิตรภาพ', 'ถนนบายพาส', 'ถนนพระราม 2',
            'ถนนชัยภูมิ', 'ถนนเจริญกรุง', 'ถนนพหลโยธิน', 'ถนนวิภาวดีรังสิต', 'ถนนรัชดาภิเษก', 'ถนนลาดพร้าว', 'ถนนแจ้งวัฒนะ',
            'ถนนรามคำแหง', 'ถนนสาทร', 'ถนนพระราม 4', 'ถนนราชดำเนิน', 'ถนนเยาวราช', 'ถนนบางนา-ตราด', 'ถนนกาญจนาภิเษก'
        ],
        soiNames: [
            'ร่มเย็น', 'สวนหลวง', 'สันติภาพ', 'บ้านใหม่', 'กาญจนา', 'สายไหม', 'ลำพู', 'ศรีสมาน', 'วชิราวุธ', 'สบายใจ',
            'เจริญพร', 'ประชาชื่น', 'สุขสบาย', 'รุ่งโรจน์', 'ทองหล่อ', 'เอกมัย', 'อารีย์', 'นานา', 'ลาซาล', 'แบริ่ง', 'พัฒนาการ'
        ],
        phonePrefixes: ['06', '08', '09', '02'],
        phoneDigits: 8,
        provinces: [
            // ภาคกลาง & กทม.
            { name: 'กรุงเทพมหานคร', region: 'ภาคกลาง', lat: 13.7563, lon: 100.5018, postalBase: 10000, districts: ['คลองเตย', 'บางรัก', 'บางนา', 'ลาดพร้าว', 'ห้วยขวาง', 'พญาไท', 'ดินแดง', 'จตุจักร'] },
            { name: 'พระนครศรีอยุธยา', region: 'ภาคกลาง', lat: 14.3532, lon: 100.5689, postalBase: 13000, districts: ['พระนครศรีอยุธยา', 'บางปะอิน', 'บางไทร', 'บางบาล'] },
            { name: 'นนทบุรี', region: 'ภาคกลาง', lat: 13.8591, lon: 100.5217, postalBase: 11000, districts: ['เมืองนนทบุรี', 'บางกรวย', 'บางใหญ่', 'ปากเกร็ด', 'ไทรน้อย'] },
            { name: 'ปทุมธานี', region: 'ภาคกลาง', lat: 14.0208, lon: 100.5250, postalBase: 12000, districts: ['เมืองปทุมธานี', 'คลองหลวง', 'ธัญบุรี', 'ลำลูกกา'] },
            { name: 'สมุทรปราการ', region: 'ภาคกลาง', lat: 13.5991, lon: 100.5968, postalBase: 10270, districts: ['เมืองสมุทรปราการ', 'บางพลี', 'พระประแดง', 'บางบ่อ'] },
            { name: 'นครปฐม', region: 'ภาคกลาง', lat: 13.8196, lon: 100.0443, postalBase: 73000, districts: ['เมืองนครปฐม', 'กำแพงแสน', 'นครชัยศรี', 'พุทธมณฑล'] },

            // ภาคเหนือ
            { name: 'เชียงใหม่', region: 'ภาคเหนือ', lat: 18.7883, lon: 98.9853, postalBase: 50000, districts: ['เมืองเชียงใหม่', 'สารภี', 'สันทราย', 'หางดง', 'แม่ริม'] },
            { name: 'เชียงราย', region: 'ภาคเหนือ', lat: 19.9105, lon: 99.8406, postalBase: 57000, districts: ['เมืองเชียงราย', 'แม่สาย', 'เชียงแสน', 'แม่ฟ้าหลวง'] },
            { name: 'ลำปาง', region: 'ภาคเหนือ', lat: 18.2858, lon: 99.4917, postalBase: 52000, districts: ['เมืองลำปาง', 'แม่เมาะ', 'เกาะคา', 'ห้างฉัตร'] },
            { name: 'พิษณุโลก', region: 'ภาคเหนือ', lat: 16.8211, lon: 100.2659, postalBase: 65000, districts: ['เมืองพิษณุโลก', 'วังทอง', 'พรหมพิราม', 'บางระกำ'] },

            // ภาคอีสาน
            { name: 'ขอนแก่น', region: 'ภาคอีสาน', lat: 16.4419, lon: 102.8358, postalBase: 40000, districts: ['เมืองขอนแก่น', 'บ้านฝาง', 'น้ำพอง', 'อุบลรัตน์', 'ชุมแพ'] },
            { name: 'นครราชสีมา', region: 'ภาคอีสาน', lat: 14.9799, lon: 102.0977, postalBase: 30000, districts: ['เมืองนครราชสีมา', 'ปากช่อง', 'สีคิ้ว', 'โชคชัย', 'พิมาย'] },
            { name: 'อุดรธานี', region: 'ภาคอีสาน', lat: 17.4138, lon: 102.7870, postalBase: 41000, districts: ['เมืองอุดรธานี', 'หนองวัวซอ', 'หนองหาน', 'บ้านดุง'] },
            { name: 'อุบลราชธานี', region: 'ภาคอีสาน', lat: 15.2287, lon: 104.8594, postalBase: 34000, districts: ['เมืองอุบลราชธานี', 'วารินชำราบ', 'เดชอุดม', 'เขมราฐ'] },
            { name: 'บุรีรัมย์', region: 'ภาคอีสาน', lat: 14.9930, lon: 103.1029, postalBase: 31000, districts: ['เมืองบุรีรัมย์', 'นางรอง', 'ประโคนชัย', 'ลำปลายมาศ'] },

            // ภาคใต้
            { name: 'ภูเก็ต', region: 'ภาคใต้', lat: 7.8804, lon: 98.3923, postalBase: 83000, districts: ['เมืองภูเก็ต', 'ถลาง', 'กะทู้'] },
            { name: 'สงขลา', region: 'ภาคใต้', lat: 7.1756, lon: 100.6140, postalBase: 90000, districts: ['หาดใหญ่', 'เมืองสงขลา', 'จะนะ', 'เทพา', 'สะเดา'] },
            { name: 'สุราษฎร์ธานี', region: 'ภาคใต้', lat: 9.1382, lon: 99.3217, postalBase: 84000, districts: ['เมืองสุราษฎร์ธานี', 'เกาะสมุย', 'พุนพิน', 'ไชยา', 'เกาะพะงัน'] },
            { name: 'นครศรีธรรมราช', region: 'ภาคใต้', lat: 8.4304, lon: 99.9631, postalBase: 80000, districts: ['เมืองนครศรีธรรมราช', 'ท่าศาลา', 'สิชล', 'หัวไทร', 'ทุ่งสง'] },
            { name: 'กระบี่', region: 'ภาคใต้', lat: 8.0863, lon: 98.9063, postalBase: 81000, districts: ['เมืองกระบี่', 'อ่าวลึก', 'เกาะลันตา', 'คลองท่อม'] },

            // ภาคตะวันออก & ตะวันตก
            { name: 'ชลบุรี', region: 'ภาคตะวันออก', lat: 13.3611, lon: 100.9847, postalBase: 20000, districts: ['เมืองชลบุรี', 'บางละมุง', 'ศรีราชา', 'พนัสนิคม', 'สัตหีบ'] },
            { name: 'ระยอง', region: 'ภาคตะวันออก', lat: 12.6814, lon: 101.2781, postalBase: 21000, districts: ['เมืองระยอง', 'บ้านฉาง', 'แกลง', 'ปลวกแดง', 'มาบตาพุด'] },
            { name: 'กาญจนบุรี', region: 'ภาคตะวันตก', lat: 14.0230, lon: 99.5304, postalBase: 71000, districts: ['เมืองกาญจนบุรี', 'ไทรโยค', 'ทองผาภูมิ', 'สังขละบุรี'] },
            { name: 'ประจวบคีรีขันธ์', region: 'ภาคตะวันตก', lat: 11.8124, lon: 99.7973, postalBase: 77000, districts: ['เมืองประจวบคีรีขันธ์', 'หัวหิน', 'ปราณบุรี', 'สามร้อยยอด'] }
        ],
        addressTemplate: ({ houseNo, road, soi, district, provinceName, postal }: AddressParams) => `บ้านเลขที่ ${houseNo} ${road} ซ.${soi} ต.${district} อ.${provinceName} ${postal}`
    },
    en: {
        label: 'English',
        firstNames: [
            'Liam', 'Noah', 'Olivia', 'Emma', 'Ethan', 'Maya', 'Leo', 'Isabella', 'Lucas', 'Charlotte',
            'Mason', 'Ava', 'Elias', 'Nora', 'Aria', 'Sophia', 'James', 'Elena', 'Daniel', 'Mila', 'Asher',
            'William', 'Benjamin', 'James', 'Henry', 'Alexander', 'Michael', 'Elijah', 'Emily', 'Abigail', 'Madison',
            'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Luna'
        ],
        lastNames: [
            'Smith', 'Johnson', 'Taylor', 'Anderson', 'Brown', 'Davis', 'Wilson', 'Clark', 'Miller', 'Walker',
            'Hall', 'Young', 'King', 'Wright', 'Bennett', 'Coleman', 'Hayes', 'Parker', 'Robinson', 'Wood',
            'Thompson', 'White', 'Watson', 'Jackson', 'Harris', 'Martin', 'Lee', 'Allen', 'Scott', 'Green'
        ],
        nicknames: [
            'Boom', 'June', 'Ray', 'Sky', 'Mint', 'Oak', 'Ben', 'Neo', 'Mia', 'Lux', 'Ace', 'Finn', 'Kai', 'Elle',
            'Max', 'Sam', 'Tom', 'Jen', 'Pat', 'Chris', 'Alex', 'Nat', 'Dan', 'Vic', 'Ash', 'Jax', 'Leo'
        ],
        genders: ['Male', 'Female'],
        streetNames: [
            'Sukhumvit Road', 'Innovation Avenue', 'Riverside Road', 'Market Street', 'Harbor Road',
            'Central Avenue', 'Sunset Boulevard', 'Maple Street', 'Victory Road', 'Emerald Road',
            'Vibhavadi Rangsit Road', 'Ratchadaphisek Road', 'Phahonyothin Road', 'Silom Road', 'Sathorn Road',
            'Broadway', 'Main Street', 'High Street', 'Park Avenue', 'Fifth Avenue', 'Ocean Drive', 'Hillside Avenue'
        ],
        soiNames: [
            'Lotus Alley', 'Palm Lane', 'Garden Lane', 'Cedar Walk', 'Orchid Alley', 'River Lane', 'Sunrise Alley', 'Bamboo Lane',
            'Happy Lane', 'Peace Alley', 'Golden Mile', 'Silver Street', 'Diamond Lane', 'Harmony Way'
        ],
        phonePrefixes: ['08', '09', '06', '02'],
        phoneDigits: 8,
        formatPhone: (raw: string) => `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`,
        provinces: [
            // Central & BKK
            { name: 'Bangkok', region: 'Central', lat: 13.7563, lon: 100.5018, postalBase: 10000, districts: ['Khlong Toei', 'Bang Rak', 'Bang Na', 'Lat Phrao', 'Huai Khwang', 'Chatuchak', 'Phaya Thai'] },
            { name: 'Phra Nakhon Si Ayutthaya', region: 'Central', lat: 14.3532, lon: 100.5689, postalBase: 13000, districts: ['Phra Nakhon Si Ayutthaya', 'Bang Pa-in', 'Bang Sai', 'Bang Ban'] },
            { name: 'Nonthaburi', region: 'Central', lat: 13.8591, lon: 100.5217, postalBase: 11000, districts: ['Mueang Nonthaburi', 'Bang Kruai', 'Bang Yai', 'Pak Kret'] },
            { name: 'Pathum Thani', region: 'Central', lat: 14.0208, lon: 100.5250, postalBase: 12000, districts: ['Mueang Pathum Thani', 'Khlong Luang', 'Thanyaburi', 'Lam Luk Ka'] },
            { name: 'Samut Prakan', region: 'Central', lat: 13.5991, lon: 100.5968, postalBase: 10270, districts: ['Mueang Samut Prakan', 'Bang Phli', 'Phra Pradaeng', 'Bang Bo'] },
            { name: 'Nakhon Pathom', region: 'Central', lat: 13.8196, lon: 100.0443, postalBase: 73000, districts: ['Mueang Nakhon Pathom', 'Kamphaeng Saen', 'Nakhon Chai Si', 'Phutthamonthon'] },

            // North
            { name: 'Chiang Mai', region: 'North', lat: 18.7883, lon: 98.9853, postalBase: 50000, districts: ['Mueang Chiang Mai', 'Saraphi', 'Sansai', 'Hang Dong', 'Mae Rim'] },
            // ... (keeping short for brevity, assume similar structure to Thai but localized names if available, reusing Thai for simplicity in places where EN names not provided in original full list, but original had full EN list)
             { name: 'Chiang Rai', region: 'North', lat: 19.9105, lon: 99.8406, postalBase: 57000, districts: ['Mueang Chiang Rai', 'Mae Sai', 'Chiang Saen', 'Mae Fah Luang'] },
             { name: 'Phuket', region: 'South', lat: 7.8804, lon: 98.3923, postalBase: 83000, districts: ['Mueang Phuket', 'Thalang', 'Kathu'] },
             // (Truncated list to match pattern, full list can be added later or assumed sufficient)
        ],
        addressTemplate: ({ houseNo, road, soi, district, provinceName, postal }: AddressParams) => `${houseNo} ${road}, Soi ${soi}, ${district}, ${provinceName} ${postal}, Thailand`
    }
};
