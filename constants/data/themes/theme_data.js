import { extendTheme } from "@chakra-ui/react";

const THEME_DATA = extendTheme({
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  colors: {
    tyto_bg: "#EEEEEE",
    tyto_teal: "#00ADB5",
    tyto_faded_black: "#393E46",
    tyto_black: "#222831",
    tyto_button_bg: "#00ADB5",
    tyto_button_text: "#EEEEEE",
  },
  components: {
    Button: {
      variants: {
        solid: {
          backgroundColor: "tyto_button_bg",
          color: "tyto_button_text",
          _hover: {
            backgroundColor: "tyto_button_bg",
            color: "tyto_button_text",
          },
          _active: {
            backgroundColor: "tyto_button_bg",
            color: "tyto_button_text",
          },
        },
      },
    },
  },
});

export default THEME_DATA;
