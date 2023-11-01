import React from 'react'
import Container from '@/components/Atoms/Container/Container'

interface CellDayTotalPaymentProps {
  totalOrderPrice: number
  totalCellDallant: number
}

const CellDayTotalPayment = ({
  totalOrderPrice,
  totalCellDallant,
}: CellDayTotalPaymentProps) => {
  return (
    <>
      <div className="py-6">
        <Container>
          <h4 className="text-xl font-bold">주문결제</h4>
        </Container>
      </div>
      <div className="py-8 border-y border-y-gray-300">
        <Container>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[15px]">총달란트</span>
              <span className="text-[15px]">
                {totalCellDallant.toLocaleString('Kr-kr')}달란트
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">주문금액</span>
              <span className="text-[15px]">
                {totalOrderPrice.toLocaleString('Kr-kr')}달란트
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">남은금액</span>
              <span
                className={`text-[15px] ${
                  totalCellDallant - totalOrderPrice >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}
              >
                {(totalCellDallant - totalOrderPrice).toLocaleString('Kr-kr')}
                달란트
              </span>
            </div>
          </div>
        </Container>
      </div>
      <div className="py-6">
        <Container>
          <div className="flex justify-between">
            <span className="text-xl font-bold">총 결제금액</span>
            <span className="text-xl font-bold">
              {totalOrderPrice.toLocaleString('Kr-kr')}달란트
            </span>
          </div>
        </Container>
      </div>
    </>
  )
}

export default CellDayTotalPayment
