/*
    Composant FAIT MAISON qui permet d'afficher un loading "dynamique" dans les temps de chargement des formulairesS
*/
import React from 'react'
import ContentLoader from 'react-content-loader'

const FormContentLoader = props => {
  return (
    <ContentLoader
      height={500}
      width={800}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="10" rx="4" ry="4" width="151" height="15" />
      <rect x="0" y="35" rx="4" ry="4" width="719" height="25" />
      <rect x="0" y="80" rx="4" ry="4" width="151" height="15" />
      <rect x="0" y="105" rx="4" ry="4" width="719" height="25" />
      <rect x="0" y="150" rx="4" ry="4" width="151" height="15" />
      <rect x="0" y="175" rx="4" ry="4" width="719" height="25" />
      <rect x="0" y="220" rx="4" ry="4" width="151" height="15" />
      <rect x="0" y="245" rx="4" ry="4" width="719" height="25" />
      <rect x="0" y="290" rx="4" ry="4" width="130" height="30" />
    </ContentLoader>
  );
}



export default FormContentLoader;