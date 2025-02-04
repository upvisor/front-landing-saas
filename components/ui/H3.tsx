export const H3 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h3
      className={`${config ? config : 'font-semibold'} text-xl lg:text-3xl`}
      style={{ color: color, lineHeight: 1.3 }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};