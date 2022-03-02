# save_dog_app
![alt text](https://github.com/rungthiwasrisaart/save_dog_app/blob/main/image/root.jpg?raw=true)
```

SAVE DOG APP
    -> Login with username ( react-router https://github.com/remix-run/react-router, App state zustand https://github.com/pmndrs/zustand )
        -> แสดงภาพหมาแบบสุ่มจาก API ( axios https://github.com/axios/axios )
            https://dog.ceo/api/breeds/image/random

        -> สามารถบันทึกภาพหมาได้ ( Component state useState, useEffect )
            -> หลังจากบันทึกแล้วให้โหลดภาพหมาอันใหม่ ( Component state useState, useEffect )
        -> สามารถลบภาพหมาได้ ( Component state useState, useEffect )
        -> โหลดภาพหมาอันใหม่ได้ ( onClick ของปุ่ม )
        -> แสดงภาพหมาทั้งหมดที่บันทึก พร้อมกับบอกว่า username คนไหนเป็นคนบันทึก ( CSS List )
        -> รีโหลดหน้าเว็บแล้วไม่ต้อง Login ใหม่ กับ ภาพที่บันทึกไม่หาย ( Local Storage, แคชชิ่ง )
        -> สามารถ Logout เพื่อเปลี่ยน username ได้ ภาพหมาห้ามหาย ( App state zustand https://github.com/pmndrs/zustand, Local Storage, แคชชิ่ง )
        -> แสดงผลได้ทั้งแบบ web และ mobile ( Responsive )

```
