export const H2 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h2
      className={`${config ? config : 'font-semibold'} text-2xl lg:text-4xl`}
      style={{ color: color, lineHeight: 1.3 }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};