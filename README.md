# Finanzas

App base en React Native con Expo SDK 54 y TypeScript.

## Requisitos

- Node.js
- pnpm
- Expo CLI via `npx expo`

## Comandos

```bash
pnpm install
pnpm exec expo start -c
```

Para abrir plataformas especificas:

```bash
pnpm android
pnpm ios
pnpm web
```

## Primera version

- Pantalla principal enfocada en categorias de gastos.
- Boton flotante para crear categorias rapido.
- Menu hamburguesa para ir a Info actual, Ingresos extra, Estadisticas y Ajustes.
- Categorias de gastos con presupuesto mensual.
- Registro de gastos con descripcion y monto.
- Alertas visuales por categoria: verde, amarillo y rojo.
- Ingresos extra separados por nombre y monto.
- Ajustes de ingreso mensual y presupuesto por categoria.
- Estadisticas del mes anterior.
- Cambio de mes automatico usando la fecha del telefono.
- Datos guardados localmente en el dispositivo.
- Navegacion por pantallas con React Navigation.
- Tema oscuro.
- Confirmacion antes de eliminar categorias o ingresos extra.
- Notificaciones locales para registrar gastos y alertas de presupuesto bajo.

## Estructura

```text
.
├── App.tsx
├── app.json
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Field.tsx
│   │   ├── FormModal.tsx
│   │   └── SummaryCard.tsx
│   ├── context
│   │   └── FinanceContext.tsx
│   ├── hooks
│   │   ├── useFinanceNotifications.ts
│   │   └── useFinanceStore.ts
│   ├── navigation
│   │   └── types.ts
│   ├── screens
│   │   ├── CurrentInfoScreen.tsx
│   │   ├── ExtraIncomeScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── StatsScreen.tsx
│   └── theme
│       └── colors.ts
│   ├── types
│   │   └── finance.ts
│   └── utils
│       ├── confirm.ts
│       ├── date.ts
│       ├── money.ts
│       ├── notifications.ts
│       └── stats.ts
└── tsconfig.json
```
