import styled from "styled-components";

const LoginContainer = styled.section`
  box-shadow: 0px 3px 26px #00000029;

  background-color: #fff;
  width: 70%;
  max-width: 800px;
  padding: 12px 12px 4rem 12px;
`;

const Input = styled.input`
  border-radius: 10px;
  background-color: #e6e6e6;
  border: 1px solid #e6e6e6;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const TextArea = styled.textarea`
  border-radius: 10px;
  background-color: #e6e6e6;
  border: 1px solid #e6e6e6;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const Select = styled.select`
  border-radius: 10px;
  background-color: #e6e6e6;
  border: 1px solid #e6e6e6;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const FileSelect = styled.button`
  background-color: #aebac9;
  padding: 8px 16px;
  border: 1px solid #aebac9;
  font-weight: bold;
  color: #000;
`;

const ExcelSelect = styled(FileSelect)`
  background-color: #ececec;
  border: 1px solid #ececec;
  font-weight: 400;
`;

const Button = styled.button`
  background-color: #002855;
  border: 1px solid #002855;
  color: #fff;
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const SecondaryButton = styled(Button)`
  background-color: #EAAA00;
  border: 1px solid #EAAA00;
`;

const TextButton = styled.span`
  color: #002855;
  font-size: 18px;
  font-weight: bold;
`;

const DasboardSection = styled.section`
  background-color: #f8f9fb;
  min-height: 100vh;
  min-width: 100%;
`;

const NavContainer = styled.nav`
  background-color: #fff;
  display: flex;
  padding: 0px 16px;
  font-size: 13px;
`;

const NavIconWrapper = styled.span`
  margin-right: 24px;
  background-color: #edf2f8;
  padding: 4px 4px;
  border-radius: 8px;
  cursor: pointer;
`;

const Header = styled.h3`
  color: #181818;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 18px;
  margin-top: 18px;
`;

const BoxShadow = styled.section`
  box-shadow: 0px 4px 6px #0000000d;
`;

const ListShadowed = styled.ul`
  box-shadow: 0px 4px 6px #0000000d;
`;

const SummaryBox = styled(BoxShadow)`
  background-color: #fff;
  border-radius: 4px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const YellowBox = styled(SummaryBox)`
  background-color: #EAAA00;
  padding: 10px 16px;
`;

const CircleAvatar = styled.div`
  background-color: #002855;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
`;

const GrayCircleAvatar = styled(CircleAvatar)`
  background-color: #aebac9;
`;

const Hr = styled.hr`
  background-color: #0000000d;
  height: 1px;
  margin: 8px 0px;
`;

const Label = styled.label`
  color: #181818;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: bold;
`;

const RedIndicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #0093c9;
`;

const BlueIndicator = styled(RedIndicator)`
  background-color: #002855;
`;

const lRow = styled.tr``;

export {
  LoginContainer,
  Input,
  Button,
  TextButton,
  DasboardSection,
  NavContainer,
  NavIconWrapper,
  Header,
  SummaryBox,
  YellowBox,
  CircleAvatar,
  Hr,
  lRow,
  ListShadowed,
  Select,
  FileSelect,
  ExcelSelect,
  GrayCircleAvatar,
  BoxShadow,
  Label,
  SecondaryButton,
  BlueIndicator,
  RedIndicator,
  TextArea,
};
