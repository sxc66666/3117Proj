import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function FooterCust({ restaurantName, totalPrice, onBack, onCheckout, checkoutText }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 设定移动端宽度标准 (sm: <640px)
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ margin: '1.5% 3%' }} className="fixed bottom-0 left-0 right-0">
      <div className="bg-base-100 rounded-lg shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between relative">
        
        {/* 移动端：餐厅名称独立一行，灰色小字 */}
        {isMobile && (
          <div className="text-sm text-gray-500 font-medium mb-2 sm:mb-0 text-center w-full">
            {restaurantName}
          </div>
        )}

        <div className="flex w-full items-center justify-between relative">
          {/* 返回按钮 */}
          <button className="btn btn-square btn-outline btn-primary" onClick={onBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 桌面端：餐厅名称固定居中 */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700">
              {restaurantName}
            </div>
          )}

          {/* 总金额 + Checkout 按钮 */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-indigo-600">$ {totalPrice.toFixed(2)}</span>
            <button className="btn btn-primary rounded-lg flex items-center gap-2 px-4 py-2" onClick={onCheckout}>
              {checkoutText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

FooterCust.propTypes = {
    restaurantName: PropTypes.string,
    totalPrice: PropTypes.number.isRequired,
    onBack: PropTypes.func.isRequired,
    onCheckout: PropTypes.func.isRequired,
    checkoutText: PropTypes.string.isRequired,
};
