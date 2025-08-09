
import { TrendingUp, Shield, Users, Globe } from "lucide-react";

export const Stats = () => {
  const stats = [
    {
      number: "500+",
      label: "Alertes traitées",
      description: "Depuis notre création",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      number: "100%", 
      label: "Confidentialité",
      description: "Garantie absolue",
      icon: Shield,
      color: "text-green-600"
    },
    {
      number: "1000+",
      label: "Membres actifs", 
      description: "Communauté engagée",
      icon: Users,
      color: "text-purple-600"
    },
    {
      number: "25",
      label: "Pays couverts",
      description: "Réseau international",
      icon: Globe,
      color: "text-yellow-600"
    }
  ];

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Notre impact en chiffres</h2>
        <p className="text-lg text-gray-700">Des résultats concrets au service de la justice</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 group-hover:bg-blue-50 transition-colors ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div className="text-4xl font-bold text-blue-900 mb-2">
              {stat.number}
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-1">
              {stat.label}
            </div>
            <div className="text-sm text-gray-600">
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <p className="text-gray-600 italic">
          "Chaque alerte compte, chaque voix est entendue, chaque action fait la différence."
        </p>
      </div>
    </section>
  );
};
