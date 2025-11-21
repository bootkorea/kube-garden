# Kube-Garden API 문서

프론트엔드에서 사용하는 백엔드 API 엔드포인트 설명입니다.

## 🌐 API 기본 정보

**Base URL**: 환경변수 `VITE_API_URL`에서 설정  
**현재 운영 URL**: `https://gi2x6tiduk.execute-api.ap-northeast-2.amazonaws.com/prod`

**인증**: 현재 인증 없음 (향후 추가 예정)  
**응답 형식**: JSON

---

## 📍 엔드포인트

### 서비스 관리

#### `GET /services`
모든 서비스 목록 조회

**응답:**
```json
{
  "services": [
    {
      "id": "uuid",
      "name": "demo-api",
      "gitUrl": "https://github.com/user/repo",
      "gitBranch": "main",
      "namespace": "default",
      "criticality": "medium",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

#### `POST /services`
새 서비스 생성

**요청:**
```json
{
  "name": "demo-api",
  "gitUrl": "https://github.com/user/repo",
  "gitBranch": "main",
  "namespace": "default",
  "criticality": "medium"
}
```

#### `GET /services/{id}`
특정 서비스 조회

#### `DELETE /services/{id}`
서비스 삭제

---

### 배포 관리

#### `POST /deploy`
새 배포 생성 및 시작

**요청:**
```json
{
  "serviceName": "demo-api",
  "githubRepo": "user/repo",
  "environment": "production",
  "description": "New feature deployment"
}
```

**응답:**
```json
{
  "deployment": {
    "id": "uuid",
    "serviceId": "uuid",
    "status": "PENDING",
    "executionArn": "arn:aws:states:...",
    "createdAt": 1234567890
  }
}
```

**참고**: `serviceName` + `githubRepo`를 제공하면 서비스가 없을 경우 자동 생성됩니다.

#### `GET /deployments`
모든 배포 이력 조회 (최신순)

**응답:**
```json
{
  "deployments": [
    {
      "id": "uuid",
      "serviceName": "demo-api",
      "status": "BUILD_COMPLETED",
      "buildStatus": "success",
      "environment": "production",
      "createdAt": 1234567890,
      "imageTag": "abc123"
    }
  ]
}
```

#### `GET /deploy/{id}`
특정 배포 상태 조회 (폴링용)

**응답:**
```json
{
  "deployment": {
    "id": "uuid",
    "status": "BUILD_COMPLETED",
    "buildStatus": "success",
    "deploymentPlan": {
      "strategy": "canary",
      "canaryWeight": 20
    },
    "error": null
  }
}
```

**프론트엔드 사용**: 3초마다 폴링하여 배포 진행 상황 확인

#### `DELETE /deploy/{id}`
배포 기록 삭제

---

## 📊 배포 상태 (Status)

배포는 다음 상태를 거칩니다:

| Status | 설명 | 다음 단계 |
|--------|------|-----------|
| `PENDING` | 배포 생성됨 | `PLAN_GENERATED` |
| `PLAN_GENERATED` | 배포 계획 생성 완료 | `BUILD_TRIGGERED` |
| `BUILD_TRIGGERED` | GitHub Actions 빌드 시작 | `BUILD_COMPLETED` |
| `BUILD_COMPLETED` | 빌드 성공 | `IMAGE_VALIDATED` |
| `IMAGE_VALIDATED` | ECR 이미지 검증 완료 | `DEPLOYED_TO_EKS` |
| `DEPLOYED_TO_EKS` | EKS에 카나리 배포 완료 | `PROMOTED` or `ROLLED_BACK` |
| `PROMOTED` | 프로덕션 프로모션 완료 | `SUCCESS` |
| `SUCCESS` | 배포 성공 (최종) | - |
| `*_FAILED` | 실패 상태 (최종) | - |

**참고**: `buildStatus` 필드는 별도로 GitHub webhook으로 실시간 업데이트됩니다.

---

## 🔔 GitHub Webhook

**엔드포인트**: `POST /webhooks/github/build-complete`

GitHub Actions가 빌드 완료 시 이 엔드포인트로 webhook을 전송합니다.  
프론트엔드에서는 직접 호출하지 않습니다.

---

## 🛠 로컬 개발

### 환경 변수 설정

`.env` 파일:
```bash
VITE_API_URL=https://gi2x6tiduk.execute-api.ap-northeast-2.amazonaws.com/prod
```

### API 호출 예시

```typescript
const API_URL = import.meta.env.VITE_API_URL;

// 배포 생성
const response = await fetch(`${API_URL}/deploy`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceName: 'demo-api',
    githubRepo: 'user/repo',
    environment: 'production',
    description: 'Test deployment'
  })
});

const data = await response.json();
console.log(data.deployment.id);

// 배포 상태 폴링
const pollStatus = async (deploymentId: string) => {
  const res = await fetch(`${API_URL}/deploy/${deploymentId}`);
  const { deployment } = await res.json();
  
  if (deployment.status === 'SUCCESS') {
    console.log('Deployment succeeded!');
  } else if (deployment.status.includes('FAILED')) {
    console.error('Deployment failed:', deployment.error);
  }
};
```

---

## 🚫 에러 응답

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**일반적인 HTTP 상태 코드**:
- `200`: 성공
- `202`: 비동기 작업 수락됨 (배포 생성 등)
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 오류

---

## 📖 추가 정보

### DynamoDB 스키마

백엔드는 두 개의 DynamoDB 테이블을 사용합니다:

**ServicesTable**:
- PK: `id` (서비스 UUID)
- 서비스 메타데이터 저장

**DeploymentsTable**:
- PK: `id` (배포 UUID)
- TTL: `expiresAt` (90일 후 자동 삭제)
- 배포 이력 및 상태 저장

### Step Functions 워크플로우

배포가 생성되면 Step Functions 상태 머신이 실행됩니다:
1. GeneratePlan → 2. TriggerBuild → 3. CheckBuild (루프) → 4. ValidateImage → 5. DeployEKS → 6. CollectMetrics → 7. AnalyzeMetrics → 8. Promote/Rollback → 9. Notify

**프론트엔드는 이 워크플로우를 알 필요 없습니다.** 단지 `/deploy/{id}` 엔드포인트를 폴링하여 `status` 필드만 확인하면 됩니다.

---

## 🔧 백엔드 코드 위치

백엔드 Lambda 함수 코드는 별도 저장소에서 관리됩니다:
- **위치**: `/Users/bootkorea/Documents/GitHub/kube-garden/aws-lambda/`
- **배포**: 백엔드 팀이 SAM CLI로 배포
- **스택**: `kube-garden-v3`

프론트엔드 개발자는 백엔드 코드를 직접 배포하거나 수정할 필요가 없습니다.
