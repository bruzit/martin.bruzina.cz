export default defineAppConfig({
  ui: {
    colors: { primary: "tango", neutral: "zinc" },
    button: {
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "font-semibold text-[#0b0c0d] bg-primary-400 hover:bg-primary-300 active:bg-primary-300",
        },
      ],
    },
  },
});
