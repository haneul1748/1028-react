import styled from "styled-components";

export const Container = styled.div`
  width: 1000px;
  margin: 35px auto;
  min-height: ${(props) => (props.height ? props.height : "600px;")};
  height: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 172, 172, 0.6);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column; 
`;

export const Title = styled.h2`
  font-size: 33px;
  color: #333333;
  margin-bottom: 70px;
`;

export const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid rgba(251, 137, 255, 0.1);
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: lightpink;
  }
`;

export const Button = styled.button`
  padding: 10px;
  background-color: rgba(255, 172, 172, 0.6);
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 40px;

  &:hover {
    background-color: rgba(255, 172, 172, 0.87);
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

export const Tab = styled.div`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.active ? "rgba(255, 172, 172, 0.87)" : "#ffffff"};
  color: ${(props) => (props.active ? "#ffffff" : "rgba(255, 172, 172, 0.87)")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: rgba(236, 153, 234, 0.51);
    color: white;
  }
`;
 
export const BoardOuter = styled.ul`
  list-style: none;
  padding: 40px;
`;

export const Board = styled.li`
  padding: 15px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }
`;

export const BoardTitle = styled.a`
  flex: 2;
  font-size: 1.2em;
  color: rgb(33, 33, 33);
  text-decoration: none;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;

export const BoardWriter = styled.span`
  font-size: 0.9em;
  flex: 1;
  text-align: center;
  color: #888888;
`;

export const BoardContent = styled.p`
  font-size: 1.2em;
  color: #555555;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 200px;
`;

export const CreateDate = styled.span`
  flex: 1;
  font-size: 0.9em;
  text-align: center;
  color: rgb(55, 55, 55);
`;

export const ImagePreview = styled.img`
  min-width: auto;
  max-width: 100%;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
`;
export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;
export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

export const CommentContainer = styled.div`
  margin-top: 20px;
`;

export const CommentItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

export const CommentAuthor = styled.p`
  font-weight: bold;
  margin: 0;
`;

export const CommentContent = styled.p`
  margin: 5px 0;
`;

export const CommentDate = styled.span`
  font-size: 12px;
  color: #888;
`;