import { Button, IconButton, Menu, MenuItem, OutlinedInput, TextField } from "@material-ui/core";
import { HistoryOutlined, MoreVertOutlined, Search } from "@material-ui/icons";
import { useSignOut } from "hooks/useSignOut";
import { useRouter } from "next/dist/client/router";
import React, { KeyboardEvent, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.palette.common.white};
  background: ${({ theme }) => theme.palette.primary.main};
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(1)}px;
  position: relative;
`;

const HistoryButton = styled(Button).attrs({
  startIcon: <HistoryOutlined />,
  color: "inherit",
})``;

const SearchBar = styled(OutlinedInput).attrs({
  placeholder: "検索",
  endAdornment: <Search />,
})`
  width: 100%;
  max-width: 200px;
  max-height: 40px;
  color: white;
  border: 1px solid white;
`;

type Props = {
  setKeyWord: (keyword: string) => void;
};

export const Header = ({ setKeyWord }: Props) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const { signOut } = useSignOut();

  return (
    <Container>
      <HistoryButton onClick={() => router.push("/history")}>履歴</HistoryButton>
      <SearchBar onChange={(e) => setKeyWord(e.target.value)} defaultValue={""} />
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertOutlined />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={signOut}>ログアウト</MenuItem>
      </Menu>
    </Container>
  );
};
