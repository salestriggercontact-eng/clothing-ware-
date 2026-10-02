export default function Loader({ inline }) {
  return <div className={inline ? 'loader-inline' : 'loader'}><span className="spin" /></div>;
}
