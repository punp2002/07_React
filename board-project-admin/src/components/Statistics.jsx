import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axiosAPI";

export default function Statistics() {
  const [readCountData, setReadCountData] = useState(null);
  const [likeCountData, setLikeCountData] = useState(null);
  const [CommentCountData, setCommentCountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userJoin, setUserJoin] = useState(null);
  const [userJoinList, setUserJoinList] = useState([]);

  const getUserJoin = async () => {
    try {
      const resp = await axiosApi.get("/admin/userJoin");
      console.log(resp.data);

      if (resp.status === 200) {
        setUserJoinList(resp.data);
      }
    } catch (error) {
      console.log("회원 조회 중 예외 발생 : ", error);
    }
  };

  // 최대 조회수 게시글 조회
  const getMaxReadCount = async () => {
    try {
      const resp = await axiosApi.get("/admin/maxReadCount");
      console.log(resp.data);

      if (resp.status === 200) {
        setReadCountData(resp.data);
      }
    } catch (error) {
      console.log("최대 조회 수 게시글 조회 중 예외 발생 : ", error);
    }
  };
  // 최대 좋아요수 게시글 조회
  const getMaxLikeCount = async () => {
    try {
      const resp = await axiosApi.get("/admin/maxLikeCount");
      console.log(resp.data);

      if (resp.status === 200) {
        setLikeCountData(resp.data);
      }
    } catch (error) {
      console.log("최대 좋아요 수 게시글 조회 중 예외 발생 : ", error);
    }
  };
  // 최대 댓글수 게시글 조회
  const getMaxCommentCount = async () => {
    try {
      const resp = await axiosApi.get("/admin/maxCommentCount");
      console.log(resp.data);

      if (resp.status === 200) {
        setCommentCountData(resp.data);
      }
    } catch (error) {
      console.log("최대 댓글 수 게시글 조회 중 예외 발생 : ", error);
    }
  };

  // 컴포넌트가 처음 마운트 될 떄 딱 1번만 실행
  // -> Statistics 컴포넌트가 화면에 마운트 될 때 서버로 세가지 데이터 요청, 응답받아야함.
  useEffect(() => {
    getMaxReadCount();
    getMaxLikeCount();
    getMaxCommentCount();
    getUserJoin();
  }, []); // 의존성 배열이 비어있기 때문에 1번만 실행

  // readCountData, likeCountData, CommentCountData에 변화가 감지될 때
  // -> isLoading 상태값을 false로 변경하기
  useEffect(() => {
    if (
      readCountData != null &&
      likeCountData != null &&
      CommentCountData != null
    ) {
      setIsLoading(false);
    }
  }, [readCountData, likeCountData, CommentCountData]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <>
        <section>
          <h2>신규 가입 회원 ({userJoinList.length}명)</h2>

          <h3>[7일 이내 가입 회원]</h3>

          <table border={"1"}>
            <thead>
              <tr>
                <th>회원번호</th>
                <th>이메일</th>
                <th>닉네임</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {userJoinList.map((user) => (
                <tr key={user.memberNo}>
                  <td>{user.memberNo}</td>
                  <td>{user.memberEmail}</td>
                  <td>{user.memberNickname}</td>
                  <td>{user.enrollDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div>
          <section className="statistics-section">
            <h2>가장 조회수 많은 게시글</h2>
            <p>게시판 종류 : {readCountData.boardName}</p>
            <p>
              게시글 번호/제목 : No.{readCountData.boardNo} /{" "}
              {readCountData.boardTitle}
            </p>
            <p>게시글 조회 수 : {readCountData.readCount}</p>
            <p>작성자 닉네임 : {readCountData.memberNickname}</p>
          </section>

          <section className="statistics-section">
            <h2>가장 좋아요 많은 게시글</h2>
            <p>게시판 종류 : {likeCountData.boardName}</p>
            <p>
              게시글 번호/제목 : No.{likeCountData.boardNo} /{" "}
              {likeCountData.boardTitle}
            </p>
            <p>게시글 좋아요 수 : {likeCountData.likeCount}</p>
            <p>작성자 닉네임 : {likeCountData.memberNickname}</p>
          </section>

          <section className="statistics-section">
            <h2>가장 댓글 많은 게시글</h2>
            <p>게시판 종류 : {CommentCountData.boardName}</p>
            <p>
              게시글 번호/제목 : No.{CommentCountData.boardNo} /{" "}
              {CommentCountData.boardTitle}
            </p>
            <p>게시글 댓글 수 : {CommentCountData.commentCount}</p>
            <p>작성자 닉네임 : {CommentCountData.memberNickname}</p>
          </section>
        </div>
      </>
    );
  }
}
