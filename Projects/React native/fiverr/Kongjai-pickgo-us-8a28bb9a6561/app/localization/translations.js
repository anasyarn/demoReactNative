export default {
  en: {
    home: {
      title: 'PickEat',
      checkout: 'Checkout',
      menu: 'Menu',
      orders: 'Orders',
      logout: 'Logout',

      delivery: 'Delivery',
      logout: 'Logout',
      wallet: 'Wallet',
      promotions: 'Promotions',
      language: 'Language',
    },
    wallet: {
      balance_label: 'Available Balance',
      spent_label: 'Spent Transaction',
      choose_amount: 'Choose amount that you would like to add',
      transfer_description: 'Please make your transfer to this account.',
      buttons: {
        confirm: 'Confirm',
      },
      one_pay_bank: 'OnePay',
      bcel_bank: 'BCEL',
      promotion_message:
        'New customer will receive additional 20% + ₭20,000 from us ex: Deposited ₭50,000 available for ₭80,000 with limited time offer, if you have question please call: 0309881545',
    },
    list: {
      title: 'Order List',
      checkout: 'Checkout',
      processing_type: 'Processing (Waiting for Server, %{type})',
      processing_now: 'Processing (Pay Now, %{type})',
      processing_new: 'New (%{type})',
      processing: 'Processing',
      paid: 'Paid',
    },
    login: {
      title: 'Login',
      facebook_title: 'Facebook Login',
      google_title: 'Google Login',
      email_format: 'Email is not correct',
      email_label: 'Email or Phone Number',
      password_label: 'Password',
      login_button: 'Login',
      signup_button: 'Sign Up',
      signin_button: 'Sign In',
      register_button: 'Register',
      signupwithphone_button: 'Sign Up With Phone',
      signupwithemail_button: 'Sign Up With E-Mail',
      verify: 'Verify',
      signinwithgoogle_button: 'Sign In With Google',
      signinwithfb_button: 'Sign In With Facebook',
      donthaveanaccount: "Don't have an account?",
    },
    register: {
      title: 'Register',
      yup_full_name: 'The name should be no longer 32 characters',
      yup_phone: 'Phone number is not valid',
      yup_email: "well that's not an email",
      yup_password: 'Password must be longer than 5 characters.',
      yup_conditions: 'Must Accept Terms and Conditions',
      full_name_label: 'Full Name',
      email_label: 'Email*',
      password_label: 'Password',
      phone_label: 'Phone Number',
      terms:
        "I agree I have read The PICKGO.COM User agreement, I'm 18 years old, and I consent to PICKGO.COM's Privacy notice and to receiving marketing communications from PICKGO.COM.",
      register_button: 'Register',
      login_button: 'Login',
      signup_button: 'Sign Up',
      signin_button: 'Sign In',
      signupwithphone_button: 'Sign Up With Phone',
      signupwithemail_button: 'Sign Up With E-Mail',
      verify: 'Verify',
    },
    detail: {
      title: 'Order details',
      order: 'Order',
      pending: 'Pending',
      waiting_for_server: 'Waiting for server',
      processing: 'Processing',
      paid: 'Paid',
      table: 'Table',
      choose_tip: 'Choose tip',
      order_total: 'Order total',
      pay_by_cash: 'Pay by cash',
      back_to_order_button: 'Back to order',
      check_your_wallet: 'Check your wallet',
      change_payment_method_button: 'Change Payment Method',
      enter_subtotal_input: 'Enter Subtotal (LAK)',
      enter_subtotal_button: 'Next',
      enter_subtotal_message:
        'Please, enter total amount that you have to make payment after please show the proof of your completed payment before leaving store, if you’re looking for reserve a table please scroll down to make your reservation.',
      edit_payment_button: 'Edit Payment',
      can_be_canceled_button: 'Cancel Order',
    },
    checkout: {
      reservationsTitle: 'Your Reservation on:',
      deleteReservation: {
        alertTitle: 'Confirm',
        alertMessage: 'Are you sure want to change reservation day or time?',
      },
      selectReservationTime: 'Select time',
      buttons: {
        makeReservation: 'Make a Reservation',
        nowAtTheRestaurant: 'Now',
        reserveAtDateTime: 'Day/Time',
      },
      pleaseScanQrCode: 'Please scan QR code',
      subtotal: 'Subtotal',
      discount: 'Discount',
      new_subtotal: 'New subtotal',
      tax: 'Tax',
      tips: 'Tips',
      total: 'Total',
      agreed_to_add_tips:
        'I agreed, to add %{tips} tip when the bill is ready.',
      tip_now_descr:
        'When the Bills arrived, you will need to confirm payment before leaving.',
      tip_customer_descr:
        'I agree to pay above total amount according my card issuer agreement.',
      promo_credit: 'Credit',
      promo_claim: 'Claim',
      guests_party_size: 'Party size',
      request_bill: 'Request Bill',
      with_tip: 'With Tip',
      check_in_with_tip: 'Check In With Tip',
      check_in_with_bill: 'Check In Request Bill',
      wait_for_server:
        "We've received your requested and one of our server will be with you shortly.",
      wait_for_server_thank: 'Thank You',
      confirm_payment: 'Confirm Payment',
      day: 'Day',
      time: 'Time',
      home_button: 'Home',
      call_server: 'Call a Server',
      card_done_button: 'Done',
      card_cancel_button: 'Cancel',
      onepay_button: 'Pay With OnePay',
      cash_button: 'Pay Cash',
      wallet_button: 'Pay With Wallet',
      card_number: 'Card Number',
      card_expiry: 'Expiry',
      card_cvc_ccv: 'CVC/CCV',
      change_payment: 'Payment methods',
      change_payment_button: 'Change',
    },
    calendar: {
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      monthNamesShort: [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May',
        'Jun.',
        'Jul.',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.',
      ],
      dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      dayNamesShort: ['Su.', 'Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.'],
      today: 'Today',
    },
    messages: {
      load_table_error: 'Load table data error',
      something_went_wrong: 'Something went wrong',
      register_success: 'Register success!',
      login_success: 'Login success!',
      claim_promotion: 'Claim promotion',
      data_format_wrong: 'Data format is wrong',
      qr_code_text: 'QR CODE TEXT IS',
      company_data_error: 'Company data error',
      reservation_success: 'Make Reservation success',
      reservation_error: 'Make Reservation error',
      unknown_error: 'Unknown error',
      call_a_server_success: 'Call a server Success',
      pay_by_cash_success: 'You will pay by cash',
      pay_by_wallet_success: 'You will pay by wallet',
      cash_notify_success: 'Cash Notify Success',
      add_funds_success: 'Add funds success %{amount}',
      required: 'Required',
      should_be_more_than_zero: 'Should be more than zero',
      should_be_a_number: 'Should be a number',
      'refill-wallet': "You don't have enought fund in your wallet",
      added_to_cart: 'Items added to cart',
      add_to_cart_error: 'Add to cart error',
    },
    languages: {
      en: 'English',
      lo: 'ພາສາລາວ',
      th: 'ไทย',
      zh: '中文',
    },
  },
  lo: {
    home: {
      title: 'PickEat',
      checkout: 'ອອກຈ່າຍເງິນ',
      menu: 'ເມນູ',
      orders: 'ລາຍການສັ່ງຊື້',
      logout: 'ອອກຈາກລະບົບ',
      wallet: 'ກະເປົາເງິນຂອງທ່ານ',
      language: 'ພາສາ',
      promotions: 'ຄົ້ນຫາຮ້ານອາຫານ',
    },
    wallet: {
      balance_label: 'ຍອດບັນຊີຂອງທ່ານ',
      spent_label: 'ໃຊ້ແລ້ວ',
      choose_amount: 'ເລືອກຈຳນວນທີ່ທ່ານຕ້ອງການເຕີມ',
      transfer_description: 'ກະລຸນາໂອນເງິນເຂົ້າບັນຊີນີ້',
      buttons: {
        cancel: 'ຍົກເລີກ',
        confirm: 'ຢືນຢັນ',
      },
      promotion_message:
        'ກະລຸນາເຕີມເງິນເຂົ້າກະເປົາແອັບກ່ອນໃຊ້, ສະມາຊິກໃໝ່ ພິເສດຮັບໄປທັນທີ 20% +  ₭20,000 ເງິນແຈກຫລັງເຕີມ: ເຕີມ: ₭50,000  ໄດ້:  ₭80,000 “ເງິນແຈກງົບມີຈຳກັດ” ມີຄຳຖາມກະລຸນາໂທ 030 9881545',
    },
    list: {
      title: 'ລາຍການສັ່ງຊື້',
      checkout: 'ອອກຈ່າຍເງິນ',
      processing_type: 'ກຳລັງລໍຖ້າພະນັກງານເຊີບຢູ່',
      processing_now: 'ຖ້າຈ່າຍເງິນ',
      processing_new: 'ລໍຖ້າພະນັກງານຕອບ',
      processing: 'ຢູ່ໃນຂະບວນການ',
      paid: 'ຈ່າຍແລ້ວ',
    },
    login: {
      title: 'ເຂົ້າສູ່ລະບົບ',
      facebook_title: 'ເຟສບຸກ ເຂົ້າ​ສູ່​ລະ​ບົບ',
      google_title: 'Google ເຂົ້າສູ່ລະບົບ',
      email_format: 'ອີເມວບໍ່ຖືກຕ້ອງ',
      email_label: 'ອີເມວຫລືເບີໂທລະສັບ',
      password_label: 'ລະຫັດຜ່ານ',
      login_button: 'ເຂົ້າສູ່ລະບົບ',
      signup_button: 'ລົງ​ທະ​ບຽນ',
      signin_button: 'ເຂົ້າ​ສູ່​ລະ​ບົບ',
      signupwithphone_button: 'ລົງທະບຽນດ້ວຍໂທລະສັບ',
      register_button: 'ລົງທະບຽນ',
      signupwithemail_button: 'ລົງທະບຽນກັບອີເມລ',
      verify: 'ຢັ້ງຢືນ',
      signinwithgoogle_button: 'ເຂົ້າສູ່ລະບົບດ້ວຍ google',
      signinwithfb_button: 'ເຂົ້າສູ່ລະບົບດ້ວຍ Facebook',
      donthaveanaccount: 'ບໍ່ມີບັນຊີບໍ?',
    },
    register: {
      title: 'ລົງທະບຽນ',
      yup_full_name: 'ຊື່ຄວນຈະຕ່ໍາກວ່າ 32 ຕົວອັກສອນ',
      yup_phone: 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ',
      yup_email: 'ນັ້ນບໍ່ແມ່ນອີເມວ',
      yup_password: 'ລະຫັດຜ່ານຕ້ອງມີຫຼາຍກວ່າ 5 ຕົວອັກສອນ.',
      yup_conditions: 'ຕ້ອງຍອມຮັບ ຂໍ້ກຳນົດ & ເງື່ອນໄຂຕ່າງໆ',
      full_name_label: ' ຊື່ເຕັມ',
      email_label: 'ີເມວ*',
      password_label: 'ລະຫັດຜ່ານ',
      phone_label: 'ເບີໂທລະສັບ',
      terms:
        'ເມື່ອກົດປຸ່ມ "ລົງທະບຽນ", ທ່ານຍອມຮັບທີ່ຈະປະຕິບັດຕາມທຸກໆເງື່ອນໄຂຜູ້ໃຊ້ງານທີ່ໄດ້ລະບຸໃນຂໍ້ກຳນົດແລະເງື່ອນໄຂ ທຸກຂໍ້ຂອງ PICKGO.LA.',
      register_button: 'ລົງທະບຽນ',
      login_button: 'ເຂົ້າສູ່ລະບົບ',
      signup_button: 'Sign Up',
      signin_button: 'Sign In',
      signupwithphone_button: 'Sign Up With Phone',
      signupwithemail_button: 'Sign Up With E-Mail',
      verify: 'Verify',
    },
    detail: {
      title: 'ລາຍລະອຽດການສັ່ງຊື້',
      order: 'ລະຫັດສັ່ງຊື້',
      pending: 'ຢູ່ໃນຂະບວນການ  ',
      waiting_for_server: 'ກຳລັງລໍຖ້າພະນັກງານເຊີບຢູ່',
      processing: 'ຢູ່ໃນຂະບວນການ',
      paid: 'ຈ່າຍແລ້ວ',
      table: 'ໂຕະ',
      choose_tip: 'ໃຫ້ທິບພະນັກງານເຊີບ',
      order_total: 'ລວມສັ່ງ',
      pay_by_cash: 'ຈ່າຍເງິນສົດ',
      enter_subtotal_input: 'ໃສ່ຈຳນວນເງິນ (LAK)',
      enter_subtotal_button: 'ຖັດໄປ',
      enter_subtotal_message:
        'ໃສ່ຈຳນວນເງິນທີ່ຕ້ອງຈ່າຍ ຫຼັງຈາກນັ້ນຕ້ອງສະແດງຫຼັກຖານຂອງການຈ່າຍເງິນສຳເລັດຂອງທ່ານໃຫ້ພະນັກງານກ່ອນອອກຈາກຮ້ານ, ຖ້າທ່ານ ກຳລັງຊອກຫາຈອງໂຕະ ກະລຸນາເລື່ອນລົງລຸ່ມເພື່ອດຳເນີນການຈອງຂອງທ່ານ.',
      back_to_order_button: 'ກັບ​ຄືນ',
      check_your_wallet: 'ກວດເບິ່ງກະເປົາເງິນຂອງທ່ານ',
      change_payment_method_button: 'ປ່ຽນວິທີການຈ່າຍເງິນ',
      edit_payment_button: 'ແກ້ໄຂການຈ່າຍເງິນ',
      can_be_canceled_button: 'ຍົກເລີກການສັ່ງ',
    },
    checkout: {
      reservationsTitle: 'ການຈອງຂອງທ່ານ:',
      deleteReservation: {
        alertTitle: 'ຢືນຢັນ',
        alertMessage: 'ທ່ານແນ່ໃຈບໍ່ ທີ່ຈະປ່ຽນການຈອງຂອງທ່ານ ?',
      },
      selectReservationTime: 'ເລືອກເວລາ',
      buttons: {
        makeReservation: 'ຢືນຢັນຈອງໂຕະ',
        nowAtTheRestaurant: 'ຈອງດຽວນີ້',
        reserveAtDateTime: 'ຈອງເວລາອື່ນ',
      },
      pleaseScanQrCode: 'ກະລຸນາສະແກນ QR ໂຄດ',
      subtotal: 'ລວມຍອດ',
      discount: 'ຈຳນວນຫຼຸດ',
      new_subtotal: 'ລວມຍອດຫລັງລຸດລາຄາ',
      tax: 'ອມພ 10%',
      tips: 'ໃຫ້ທິບພະນັກງານເຊີບ',
      total: 'ລວມທັງ ໝົດ',
      agreed_to_add_tips:
        'ຕົກລົງເຫັນດີ, ໃຫ້ທິບພະນັກງານເຊີບ %{tips} ເມື່ອໃບບິນພ້ອມແລ້ວ, ບໍ່ຕ້ອງການເຫັນບິນ.',
      agreed_to_no_tips:
        'ທ່ານບໍ່ຕ້ອງການເຫັນບິນ. ຕົກລົງໃຫ້ພະນັກງານເກັບເງິນຈາກບັນຊີ ທ່ານໄປໂລດ',
      tip_now_descr:
        'ທາງເລືອກອ໊ອບເຊິນນີ້ທ່ານຈະຕ້ອງຢືນຢັນການຈ່າຍເງິນຂອງທ່ານກ່ອນຈະອອກຈາກຮ້ານ',
      tip_customer_descr:
        ' ຂ້າພະເຈົ້າຕົກລົງຈ່າຍຈຳນວນທັງ ໝົດ ຕາມຂໍ້ຕົກລົງຂອງຜູ້ອອກບັດຂອງ ຂ້າພະເຈົ້າ.',
      promo_credit: 'ເຄຣດິດ',
      promo_claim: ' ຮັບເອົາ',
      guests_party_size: 'ຈຳນວນແຂກຈັກຄົນ',
      request_bill: 'ເຫັນບິນກ່ອນຈ່າຍ ',
      with_tip: 'ເກັບເງິນໂລດ',
      check_in_with_tip: 'ຈອງໂຕະ',
      check_in_with_bill: 'ຈອງໂຕະ',
      wait_for_server:
        'ພວກເຮົາໄດ້ຮັບຄຳຮ້ອງຂໍຂອງທ່ານແລ້ວ ກະລຸນາລໍຖ້າຈັກນ້ອຍພະນັກງານເຮົາຈະມາໃຫ້ບໍລິການທ່ານ',
      wait_for_server_thank: 'ຂໍຂອບໃຈ',
      confirm_payment: 'ຢືນຢັນຈ່າຍເງິນ',
      day: 'ມື້',
      time: 'ເວລາ',
      home_button: 'ໜ້າຫລັກ',
      call_server: 'ເອີ້ນພະນັກງານ',
      card_done_button: 'ແລ້ວໆ',
      card_cancel_button: 'ຍົກເລີກ',
      card_done_button: 'ແລ້ວໆ',
      cash_button: 'ຈ່າຍເງິນສົດ',
      wallet_button: 'ຈ່າຍຜ່ານກະເປົາ ແອັບ',
      card_number: 'ເລກບັດ',
      card_expiry: 'ໝົດ ອາຍຸ',
      card_cvc_ccv: 'CVC/CCV',
      change_payment: 'ວິທີການຈ່າຍເງິນ',
      change_payment_button: 'ປ່ຽນ',
    },
    calendar: {
      monthNames: [
        'ມັງກອນ',
        'ກຸມພາ',
        'ມີນາ',
        'ເມສາ',
        'ພຶດສະພາ',
        'ມິຖຸນາ',
        'ກໍລະກົດ',
        'ສິງຫາ',
        'ກັນຍາ',
        'ຕຸລາ',
        'ພະຈິກ',
        'ທັນວາ',
      ],
      monthNamesShort: [
        'ເດືອນ 1.',
        'ເດືອນ 2.',
        'ເດືອນ 3.',
        'ເດືອນ 4.',
        'ເດືອນ 5.',
        'ເດືອນ 6.',
        'ເດືອນ 7.',
        'ເດືອນ 8.',
        'ເດືອນ 9.',
        'ເດືອນ 10.',
        'ເດືອນ 11.',
        'ເດືອນ 12.',
      ],
      dayNames: [
        'ວັນທິດ',
        'ວັນຈັນ',
        'ວັນຄານ',
        'ວັນພຸດ',
        'ວັນພະຫັດ',
        'ວັນສຸກ',
        'ວັນເສົາ',
      ],
      dayNamesShort: [
        'ທິດ.',
        'ຈັນ.',
        'ຄານ.',
        'ພຸດ.',
        'ພະຫັດ.',
        'ສຸກ.',
        'ເສົາ.',
      ],
      today: 'ມື້ນີ້',
    },
    messages: {
      load_table_error: 'ໂຫຼດຂໍ້ມູນຜິດພາດ',
      something_went_wrong: 'ມີບາງຢ່າງຜິດປົກກະຕິ',
      register_success: 'ລົງທະບຽນສຳເລັດແລ້ວ!',
      login_success: 'ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ',
      claim_promotion: 'ຮັບເອົາສ່ວນຫຼຸດ  ',
      data_format_wrong: 'ຂໍ້ມູນຜິດພາດ',
      qr_code_text: 'ລະຫັດ QR CODE ແມ່ນ',
      company_data_error: 'ຂໍ້ມູນບໍລິສັດບໍ່ຖືກຕ້ອງ      ',
      reservation_success: 'ການຈອງຂອງທ່ານສຳເລັດແລ້ວ',
      reservation_error: 'ການຈອງຂອງທ່ານຂໍ້ມູນບໍລິສັດບໍ່ຖືກຕ້ອງ ',
      unknown_error: 'ບໍ່ຮູ້ເຫດຜົນ',
      call_a_server_success: 'ສົ່ງແລ້ວ ກະລຸນາລໍຖ້າ',
      pay_by_cash_success: 'ຈ່າຍເງິນສົດ',
      cash_notify_success: 'ຈ່າຍເງິນສົດ',
      'refill-wallet':
        'ທ່ານບໍ່ມີເງິນພຽງພໍ ກະລຸນາຕື່ມເງີນເຂົ້າໃນກະເປົາເງິນຂອງທ່ານ',
      added_to_cart: 'Items added to cart',
      add_to_cart_error: 'Add to cart error',
    },
  },
  th: {
    home: {
      title: 'PickEat',
      checkout: 'เช็คเอาท์',
      menu: 'เมนู',
      orders: 'รายการสั่งซื้อ',
      logout: 'ออกจากระบบ',
      wallet: 'กระเป๋าสตางค์',
      language: 'ภาษา',
      promotions: 'ค้นหาร้านอาหาร',
    },
    wallet: {
      balance_label: 'ยอดเงินคงเหลือ',
      spent_label: 'ถูกใช้แล้ว',
      choose_amount: 'เลือกจำนวนเงินที่คุณต้องการเติม',
      transfer_description: 'โปรดโอนเงินไปยังบัญชีนี้',
      buttons: {
        cancel: 'ยกเลิก',
        confirm: 'ยืนยัน',
      },
      promotion_message:
        'กรุณาเติมเงินในกระเป๋าของคุณก่อนใช้งาน ลูกค้าใหม่พิเศษจะได้รับทันที 20% + ₭20,000 หลังจากเติมเงิน: เติมเงิน: ₭ 50,000:  ได้: ₭80,000“ งบจำกัด',
    },
    list: {
      title: 'รายการสั่งซื้อ',
      checkout: 'ออกจากระบบ',
      processing_type: 'รอพนักงานตอบกลับ',
      processing_now: 'กำลังรอการชำระเงิน',
      processing_new: 'รอให้พนักงานตอบกลับ',
      processing: 'อยู่ในขั้นตอน',
      paid: 'จ่ายแล้ว',
    },
    login: {
      title: 'เข้าสู่ระบบ',
      facebook_title: 'เฟสบุ๊ค เข้าสู่ระบบ',
      google_title: 'Google เข้าสู่ระบบ',
      email_format: 'ອอีเมลไม่ถูกต้อง',
      email_label: 'อีเมลหรือหมายเลขโทรศัพท์',
      password_label: 'รหัสผ่าน',
      login_button: 'เข้าสู่ระบบ',
      signup_button: 'ลงชื่อ',
      signin_button: 'เข้าสู่ระบบ',
      signupwithphone_button: 'ลงทะเบียนด้วยโทรศัพท์',
      register_button: 'ลงทะเบียน',
      signupwithemail_button: 'ลงทะเบียนด้วยอีเมล',
      verify: 'ตรวจสอบ',
      signinwithgoogle_button: 'ลงชื่อเข้าใช้ด้วย Google',
      signinwithfb_button: 'ลงชื่อเข้าใช้ด้วย Facebook',
      donthaveanaccount: 'ยังไม่มีบัญชี?',
    },
    register: {
      title: 'ລลงทะเบียน',
      yup_full_name: 'ชื่อควรน้อยกว่า 32 ตัวอักษร',
      yup_phone: 'หมายเลขโทรศัพท์ไม่ถูกต้อง',
      yup_email: 'นั่นไม่ใช่อีเมล',
      yup_password: 'รหัสผ่านต้องมีอักขระเกิน 5 ตัว',
      yup_conditions: ' ต้องยอมรับข้อกำหนดและเงื่อนไข',
      full_name_label: ' ชื่อเต็ม',
      email_label: 'อีเมล*',
      password_label: 'รหัสผ่าน',
      phone_label: 'หมายเลขโทรศัพท์',
      terms:
        'เมื่อคลิกปุ่ม "ลงทะเบียน" คุณยอมรับที่จะปฏิบัติตามข้อกำหนดของผู้ใช้ทั้งหมดที่ระบุไว้ในข้อกำหนดและเงื่อนไข PICKGO.LA.',
      register_button: 'ลงทะเบียน',
      login_button: 'เข้าสู่ระบบ',
      signup_button: 'Sign Up',
      signin_button: 'Sign In',
      signupwithphone_button: 'Sign Up With Phone',
      signupwithemail_button: 'Sign Up With E-Mail',
      verify: 'Verify',
    },
    detail: {
      title: 'รายละเอียดการสั่งซื้อ',
      order: 'หมายเลขสั่งซื้อ',
      pending: 'รอดำเนินการ  ',
      waiting_for_server: 'รอดำเนินการ',
      processing: 'อยู่ในขั้นตอน',
      paid: 'จ่ายแล้ว',
      table: 'โต๊ะ',
      choose_tip: 'ให้ทิปกับเซิร์ฟเวอร์',
      order_total: 'ยอดสั่งซื้อทั้งหมด',
      pay_by_cash: 'จ่ายด้วยเงินสด',
      enter_subtotal_input: 'ป้อนจำนวนเงิน (LAK)',
      enter_subtotal_button: 'ต่อไป',
      enter_subtotal_message:
        'ใส่เงินทั้งหมดที่ต้องจ่าย หลังจากนั้นต้องแสดงหลักฐานการชำระเงินที่เสร็จสมบูรณ์ให้กับพนักงานก่อนออกจากร้าน, หากคุณจองโต๊ะโปรดเลื่อนลงเพื่อดำเนินการจองของคุณ',
      edit_payment_button: 'แก้ไขการชำระเงิน',
      back_to_order_button: 'กลับ',
      check_your_wallet: 'ตรวจสอบกระเป๋าเงินของคุณ',
      change_payment_method_button: 'เปลี่ยนวิธีการชำระเงิน',
      can_be_canceled_button: 'ยกเลิกการสั่ง',
    },
    checkout: {
      reservationsTitle: 'การจองของคุณ:',
      deleteReservation: {
        alertTitle: 'ยืนยัน',
        alertMessage: 'คุณแน่ใจหรือว่าต้องการเปลี่ยนการจองของคุณ ?',
      },
      selectReservationTime: 'เลือกเวลา',
      buttons: {
        makeReservation: 'ยืนยันการจอง',
        nowAtTheRestaurant: 'จองตอนนี้',
        reserveAtDateTime: 'จองเวลาอื่น',
      },
      pleaseScanQrCode: 'กรุณาสแกนรหัส QR',
      subtotal: 'ยอดรวม',
      discount: 'ส่วนลด',
      new_subtotal: 'ยอดรวมหลังหักส่วนลด',
      tax: 'ภาษี',
      tips: 'ให้ทิปกับเซิร์ฟเวอร์',
      total: 'ทั้งหมด',
      agreed_to_add_tips:
        'เห็นด้วย, ให้ทิปกับเซิร์ฟเวอร์ %{tips} คิดเงินฉันเมื่อใบเรียกเก็บเงินพร้อม, โดยไม่จำเป็นต้องส่งใบเรียกเก็บเงินมาให้ฉัน.',
      agreed_to_no_tips:
        'คุณไม่ต้องการเห็นใบเรียกเก็บเงิน. เห็นด้วยคิดเงินคุณเมื่อใบเรียกเก็บเงินพร้อม',
      tip_now_descr: 'ด้วยตัวเลือกนี้คุณจะต้องยืนยันการชำระเงินก่อนออกจากร้าน',
      tip_customer_descr:
        ' ฉันตกลงที่จะชำระเงินเต็มจำนวนตามดุลยพินิจของผู้ออกบัตรของฉัน        .',
      promo_credit: 'เครดิต',
      promo_claim: ' กดรับ',
      guests_party_size: 'มีแขกกี่คน',
      request_bill: 'ดูบิลก่อนจ่าย ',
      with_tip: 'ด่วน',
      check_in_with_tip: 'จองโต๊ะ',
      check_in_with_bill: 'จองโต๊ะ',
      wait_for_server:
        ' เราได้รับคำขอของคุณแล้ว และโปรดรอเจ้าหน้าที่ของเรามาให้บริการคุณ',
      wait_for_server_thank: 'ขอบคุณ',
      confirm_payment: 'ยืนยันการชำระเงิน',
      day: 'วัน',
      time: 'เวลา',
      home_button: 'หน้าแรก',
      call_server: 'เรียกพนักงาน เซิร์ฟเวอร์',
      card_done_button: 'เสร็จแล้ว',
      card_cancel_button: 'ยกเลิก',
      card_done_button: 'เสร็จแล้ว',
      cash_button: 'จ่ายด้วยเงินสด',
      wallet_button: 'ชำระเงินด้วยแอพ',
      card_number: 'หมายเลขบัตร',
      card_expiry: 'วันหมดอายุ',
      card_cvc_ccv: 'CVC/CCV',
      change_payment: 'วิธีการชำระเงิน',
      change_payment_button: 'เปลี่ยน',
    },
    calendar: {
      monthNames: [
        'มังกร',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'ກໍລະກົດ',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
      ],
      monthNamesShort: [
        'เดือน 1.',
        'เดือน 2.',
        'เดือน 3.',
        'เดือน 4.',
        'เดือน 5.',
        'เดือน 6.',
        'เดือน 7.',
        'เดือน 8.',
        'เดือน 9.',
        'เดือน 10.',
        'เดือน 11.',
        'เดือน 12.',
      ],
      dayNames: [
        'วันอาทิตย์',
        'วันจันทร์',
        'วันอังคาร',
        'วันพุธ',
        'วันพฤหัสบดี',
        'วันศุกร์',
        'วันเสาร์',
      ],
      dayNamesShort: [
        'อาทิตย์.',
        'จันทร์.',
        'อังคาร.',
        'พุธ.',
        'พฤหัสบดี.',
        'ศุกร์.',
        'เสาร์.',
      ],
      today: 'ในวันนี้',
    },
    messages: {
      load_table_error: 'เกิดข้อผิดพลาดในการโหลด',
      something_went_wrong: 'บางอย่างผิดพลาด',
      register_success: 'ลงทะเบียนสำเร็จแล้ว!',
      login_success: 'เข้าสู่ระบบสำเร็จแล้ว',
      claim_promotion: 'รับส่วนลด  ',
      data_format_wrong: 'ข้อมูลผิด',
      qr_code_text: 'รหัส QR คือ',
      company_data_error: 'ข้อมูล บริษัท ไม่ถูกต้อง',
      reservation_success: 'การจองของคุณสำเร็จแล้ว',
      reservation_error: 'การจองของคุณ ข้อมูล บริษัท ไม่ถูกต้อง',
      unknown_error: 'ไม่ทราบเหตุผล',
      call_a_server_success: 'ส่งสำเร็จแล้ว และโปรดรอ',
      pay_by_cash_success: 'จ่ายด้วยเงินสด',
      cash_notify_success: 'จ่ายด้วยเงินสด',
      'refill-wallet': 'คุณไม่มีเงินเพียงพอในกระเป๋าเงินของคุณ',
      added_to_cart: 'Items added to cart',
      add_to_cart_error: 'Add to cart error',
    },
  },
  zh: {
    home: {
      checkout: '扫瞄',
      menu: '菜单',
      orders: '你的命令',
      logout: '登出',
      wallet: '钱包',
      language: '语言',
      promotions: '搜索餐厅',
    },
    wallet: {
      balance_label: '可用余额',
      spent_label: '活动项目',
      choose_amount: '请选择您要添加的数量',
      transfer_description: '请在下面显示转移到该帐户的信息',
      buttons: {
        cancel: '取消',
        confirm: '确认',
      },
      promotion_message:
        '新客户将从我们这里获得额外的20％+₭20,000，例如：存有₭50,000，可用₭80,000限时优惠, 如果您有任何疑问，请致电：0309881545',
    },
    list: {
      title: '订单',
      checkout: '扫瞄',
      processing_type: '等待答复',
      processing_now: '处理中',
      processing_new: '收到订单',
      processing: '进行中',
      paid: '已付费',
    },
    login: {
      title: '登录',
      facebook_title: '脸书 登录',
      google_title: '谷歌 登录',
      email_format: '电邮不正确',
      email_label: '电子邮件或电话号码',
      password_label: '密码',
      login_button: '登录',
      register_button: '寄存器',
      signup_button: 'Sign Up',
      signin_button: 'Sign In',
      signupwithphone_button: 'Sign Up With Phone',
      signupwithemail_button: 'Sign Up With E-Mail',
      verify: 'Verify',
      signinwithgoogle_button: 'Sign In With Google',
      signinwithfb_button: 'Sign In With Facebook',
      donthaveanaccount: "Don't have an account?",
    },
    register: {
      title: '寄存器',
      yup_full_name: '名称不应超过32个字符',
      yup_phone: '电话号码无效',
      yup_email: '那不是电子邮件',
      yup_password: '密码必须超过5个字符。',
      yup_conditions: '必须接受条款和条件',
      full_name_label: '全名',
      email_label: '电子邮件*',
      password_label: '密码',
      phone_label: '电话号码',
      terms:
        '我同意我已阅读 PICKGO.COM 用户协议，今年18岁，并且我同意         PICKGO.COM 的隐私声明并接受 PICKGO.COM 的营销信息',
      register_button: '寄存器',
      login_button: '登录',
      signup_button: 'Sign Up',
      signin_button: 'Sign In',
      signupwithphone_button: 'Sign Up With Phone',
      signupwithemail_button: 'Sign Up With E-Mail',
      verify: 'Verify',
    },
    detail: {
      title: '订单详细信息',
      order: '订购',
      pending: '待定',
      waiting_for_server: '等待服务器',
      processing: '处理中',
      paid: '已付费',
      table: '表',
      choose_tip: '选择小费',
      order_total: '合计订单',
      pay_by_cash: '现金支付',
      enter_subtotal_input: '输入总金额 (LAK)',
      enter_subtotal_button: '下一个',
      enter_subtotal_message:
        '输入必须支付的总金额, 之后必须在离开商店之前向商店员工出示已完成付款的证明, 如果您要预订餐桌，请向下滚动以进行预订',
      edit_payment_button: '编辑付款',
      back_to_order_button: '背部',
      check_your_wallet: '检查你的钱包',
      change_payment_method_button: '更改付款方式',
      can_be_canceled_button: '取消订单',
    },
    checkout: {
      reservationsTitle: '您的预订：',
      deleteReservation: {
        alertTitle: '确认',
        alertMessage: '您确定要更改预订吗？',
      },
      selectReservationTime: '选择时间',
      buttons: {
        makeReservation: '做一个预约',
        nowAtTheRestaurant: '现在',
        reserveAtDateTime: '选择时间',
      },
      pleaseScanQrCode: '请扫描二维码',
      subtotal: '小计',
      discount: '折扣',
      new_subtotal: '新总计',
      tax: '税',
      tips: '提示',
      total: '总',
      agreed_to_add_tips: '我同意，在帐单准备好时添加％{提示}小费。 快递无票据',
      tip_now_descr: '帐单到达后，您需要在离开前确认付款。',
      tip_customer_descr: '我同意根据发卡机构的协议支付上述总额。',
      promo_credit: '信用',
      promo_claim: '索偿促销',
      guests_party_size: '党的大小',
      request_bill: '要求帐单',
      with_tip: '表达',
      check_in_with_tip: '确认储备金表',
      check_in_with_bill: '确认储备金表',
      wait_for_server: '我们已收到您的要求，我们的服务器之一将很快与您在一起。',
      wait_for_server_thank: '谢谢',
      confirm_payment: '确认付款',
      day: '天',
      time: '时间',
      home_button: '家',
      call_server: '呼叫伺服器',
      card_done_button: '完成了',
      card_cancel_button: '取消',
      card_done_button: '完成了',
      cash_button: '付现金',
      wallet_button: '用钱包付款',
      card_number: '卡号',
      card_expiry: '到期',
      card_cvc_ccv: 'CVC/CCV',
      change_payment: '付款方法',
      change_payment_button: '更改',
    },
    calendar: {
      monthNames: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
      monthNamesShort: [
        '一月.',
        '二月.',
        '三月.',
        '四月.',
        '五月',
        '六月.',
        '七月.',
        '八月.',
        '九月.',
        '十月.',
        '十一月.',
        '十二月.',
      ],
      dayNames: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ],
      dayNamesShort: ['日.', '一.', '二.', '三.', '四.', '五.', '六.'],
      today: 'Today',
    },
    messages: {
      load_table_error: '加载表数据错误',
      something_went_wrong: '出了些问题',
      register_success: '注册成功！',
      login_success: '登录成功！',
      claim_promotion: '索偿促销',
      data_format_wrong: '数据格式错误',
      qr_code_text: 'QR代码文本为',
      company_data_error: '公司资料错误',
      reservation_success: '预订成功',
      reservation_error: '使预订错误',
      unknown_error: '未知错误',
      call_a_server_success: '呼叫服务器成功',
      call_a_server_received: '我们的工作人员在路上',
      pay_by_cash_success: '您将支付海湾现金',
      cash_notify_success: '现金通知成功',
      'refill-wallet': '您的钱包里没有足够的资金',
      added_to_cart: 'Items added to cart',
      add_to_cart_error: 'Add to cart error',
    },
  },
};