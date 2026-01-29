import bcrypt from 'bcrypt';



(async () => {
    const hash = await bcrypt.hash("Mudar@1234", 10);
    console.log(hash);
})();

(async () => {
   const ok = await bcrypt.compare("Mudar@1234", "$2b$10$R8MSN82YAn3jCGH.9DNcruzQ0yzOgOhSOjQcxzo9RFDzHH51Ajx1G");
   console.log(ok); // deve imprimir TRUE
})();