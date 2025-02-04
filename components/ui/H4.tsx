export const H4 = ({ config, text }: { config?: string, text?: string }) => {
  return (
    <h4
      className={`${config ? config : 'font-semibold'} text-lg lg:text-2xl`}
      style={{ lineHeight: 1.3 }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};