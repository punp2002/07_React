import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axiosAPI";

export default function Manager() {
  const [adminList, setAdminList] = useState([]);

  // 이메일, 닉네임, 전화번호
  // 객체 하나로 상태 관리하는 방식
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    tel: "",
  });

  // 객체형태 상태 변경 함수
  const handleChange = (e) => {
    const { id, value } = e.target; // 대상의 id 속성값, value 값을 꺼내옴
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 관리자 계정 발급
  async function createAdminAccount() {
    const { email, nickname, tel } = form; // form 상태안에 있는 값 하나씩 꺼냉기
    if (email.length === 0 || nickname.length === 0 || tel.length === 0) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    try {
      const response = await axiosApi.post("/admin/createAdminAccount", {
        memberEmail: email,
        memberNickname: nickname,
        memberTel: tel,
      });

      if (response.status === 201) {
        const result = response.data; // 서버에서 응답해준 데이터(body)
        alert(
          `발급된 비밀번호는 ${result} 입니다. 다시 확인할 수 없으니 저장해주시기 바랍니다.`
        );
        console.log(result);
      }

      // 입력필드 초기화
      setForm({
        email: "",
        nickname: "",
        tel: "",
      });
    } catch (err) {
      alert(err.response.data);
      // 409일 때, 500일 때 응답받은 body 내용이 반영되어 alert 출력할 수 있게끔 함.
    }
  }

  const getAdminList = async () => {
    try {
      const resp = await axiosApi.get("/admin/getAdminList");
      if (resp.status === 200) {
        setAdminList(resp.data);
      }
    } catch (err) {
      console.error("관리자 목록 조회 중 오류:", err);
    }
  };

  useEffect(() => {
    getAdminList();
  }, []);

  return (
    <>
      <div className="manager-div">
        <section className="manager-section">
          <h2>관리자 계정 발급</h2>
          <table>
            <thead>
              <tr>
                <td>사용할 이메일 : </td>
                <td>
                  <input
                    id="email"
                    type="email"
                    placeholder="ex) admin2@kh.or.kr"
                    value={form.email}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>사용할 이름 : </td>
                <td>
                  <input
                    id="nickname"
                    type="text"
                    placeholder="ex) 관리자2"
                    value={form.nickname}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>사용할 전화번호 : </td>
                <td>
                  <input
                    id="tel"
                    type="text"
                    placeholder="ex) 01012341234"
                    value={form.tel}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
          <button className="issueBtn" onClick={createAdminAccount}>
            발급
          </button>
        </section>

        <section className="manager-section">
          <h2>관리자 계정 목록</h2>
          <table className="manager-list-table" border={1}>
            <thead>
              <tr>
                <th>번호</th>
                <th>이메일</th>
                <th>관리자명</th>
              </tr>
            </thead>
            <tbody>
              {adminList.length === 0 ? (
                <tr>
                  <td colSpan={3}>조회된 관리자 계정이 없습니다.</td>
                </tr>
              ) : (
                adminList.map((admin, index) => (
                  <tr key={admin.memberNo}>
                    <td>{index + 1}</td>
                    <td>{admin.memberEmail}</td>
                    <td>{admin.memberNickname}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
