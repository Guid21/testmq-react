type TH1Props = Readonly<{
  children: string;
}>;

export const H1 = ({ children }: TH1Props) => {
  return <h1>{children}</h1>;
};
