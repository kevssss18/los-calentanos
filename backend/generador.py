import qrcode
from PIL import Image

# Aquí pondremos tu enlace definitivo de GitHub Pages cuando actualicemos el HTML
enlace_pagina = "https://kevss180.github.io/Los-calentanos-Cuenta/"

# Configuración del QR
qr = qrcode.QRCode(
    version=5, # Tamaño del QR (1 a 40)
    error_correction=qrcode.constants.ERROR_CORRECT_H, # Alta corrección de errores para que aguante un logo
    box_size=10,
    border=4,
)

qr.add_data(enlace_pagina)
qr.make(fit=True)

# Generar la imagen del QR en colores
img_qr = qr.make_image(fill_color="#0f172a", back_color="white").convert('RGB')

# Guardar el QR final
img_qr.save("qr_mariscos_definitivo.png")
print("¡Listo che! Tu QR infinito se guardó como qr_mariscos_definitivo.png")