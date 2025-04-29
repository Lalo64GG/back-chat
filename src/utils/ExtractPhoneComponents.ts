import IPhoneComponents from "../Interfaces/DTOS/Message/PhoneComponents"

const extractPhoneComponent = (phoneNumber: string): IPhoneComponents => {
    const cleanedNumber = phoneNumber.replace(/^whatsapp:/, '');
    const match = cleanedNumber.match(/^(\+\d{2})(?:1)?(\d{10})$/);


  if (!match) throw new Error('Número telefónico inválido');

  const countryCode = match[1]; 
  const phone = match[2];        

  console.log(phone)

  return { countryCode, phone };
}

export default extractPhoneComponent;
