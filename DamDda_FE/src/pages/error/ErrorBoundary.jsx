import React from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 상태 업데이트
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅 등 추가 작업 수행 가능
    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 에러가 발생했을 때 특정 페이지로 리다이렉트
      return <Navigate to="/error" replace />;
    }

    // 에러가 없을 때 자식 컴포넌트를 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;
