# feliz-mes

A romantic surprise website built for a special date anniversary, now powered by **Next.js**. It walks through four screens: a name-locked entry, a spinning roulette to pick an activity, a time selector, and a final reveal with the meetup details.

## How it works

1. The page unlocks when the recipient types the correct name.
2. A slot-machine roulette spins through activity options: cine, pickleball, cena, minigolf, go karts, pintura, volleyball.
3. She picks a time (5pm – 9pm).
4. A final screen shows the message and pickup details.



Para probarlo, puedes cambiar temporalmente START_DATE en config.js. Por ejemplo:

new Date(2025, 5, 11) → simula hoy (no es día 14): "Faltan..."
new Date(2025, 5, 14) → simula día 14 con meses: "Feliz..."
new Date(2024, 5, 11) → simula aniversario exacto: "Feliz aniversario..."