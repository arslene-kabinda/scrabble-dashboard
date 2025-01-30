import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const PieChart = ({ walletAmount }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Définition des couleurs en utilisant ta palette
  const colorPalette = ["#0080ff", "#6093ff", "#89a8ff", "#abbdff", "#c8d2ff", "#e4e8ff", "#ffffff"];

  // Simulation d'une répartition des fonds
  const data = [
    {
      id: "Dépensé",
      label: "Dépensé",
      value: walletAmount * 0.4, // Supposons 40% dépensé
      color: colorPalette[0], // Bleu vif
    },
    {
      id: "Disponible",
      label: "Disponible",
      value: walletAmount * 0.6, // Supposons 60% encore disponible
      color: colorPalette[2], // Bleu plus clair
    },
  ];

  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          ticks: { line: { stroke: colors.grey[100] }, text: { fill: colors.grey[100] } },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ datum: "data.color" }} // Utilisation des couleurs personnalisées
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateX: 0,
          translateY: 56,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          symbolSize: 18,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default PieChart;
