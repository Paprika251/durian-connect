import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";

const FinancialOverview = () => {
  const handleApprove = (recordId: string) => {
    toast.success(`อนุมัติรายการ ${recordId} เรียบร้อยแล้ว!`);
  };

  const handleReject = (recordId: string) => {
    toast.error(`ปฏิเสธรายการ ${recordId} แล้ว`);
  };

  // Mock financial data
  const financialSummary = {
    totalIncome: 450000,
    totalExpense: 125000,
    netProfit: 325000,
    pendingApproval: 5
  };

  const pendingRecords = [
    {
      id: 'F001',
      type: 'expense',
      amount: 2500,
      description: 'ซื้อปุ่ยคอก 10 กระสอบ',
      paymentMethod: 'เงินสด',
      invoiceRef: 'INV-001',
      date: '2024-01-15',
      brokerName: 'นายสมชาย ใจดี'
    },
    {
      id: 'F002',
      type: 'expense',
      amount: 1200,
      description: 'ค่าน้ำมันเครื่องจักร',
      paymentMethod: 'โอนเงิน',
      invoiceRef: 'INV-002',
      date: '2024-01-14',
      brokerName: 'นายสมชาย ใจดี'
    },
    {
      id: 'F003',
      type: 'income',
      amount: 15000,
      description: 'ขายทุเรียนเกรด A - 150 กก.',
      paymentMethod: 'โอนเงิน',
      invoiceRef: 'SAL-001',
      date: '2024-01-13',
      brokerName: 'นายสมชาย ใจดี'
    }
  ];

  const approvedRecords = [
    {
      id: 'F004',
      type: 'income',
      amount: 25000,
      description: 'ขายทุเรียนเกรด A+B - 230 กก.',
      date: '2024-01-12',
      status: 'approved'
    },
    {
      id: 'F005',
      type: 'expense',
      amount: 3200,
      description: 'จ้างแรงงานเก็บเกี่ยว',
      date: '2024-01-11',
      status: 'approved'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/owner-dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">รายรับ-รายจ่าย</h1>
                <p className="text-muted-foreground">จัดการและอนุมัติรายการเงินของสวน</p>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-soft">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-card border-0 bg-gradient-to-br from-green-50 to-green-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  ฿{financialSummary.totalIncome.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">รายรับรวม</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-red-50 to-red-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">
                  ฿{financialSummary.totalExpense.toLocaleString()}
                </div>
                <div className="text-sm text-red-600">รายจ่ายรวม</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <Calculator className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">
                  ฿{financialSummary.netProfit.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">กำไรสุทธิ</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-700">
                  {financialSummary.pendingApproval}
                </div>
                <div className="text-sm text-yellow-600">รออนุมัติ</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approval */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              รายการรออนุมัติ ({pendingRecords.length})
            </h2>
            
            <div className="space-y-4">
              {pendingRecords.map((record) => (
                <Card key={record.id} className="shadow-card border-0 bg-card/80 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${record.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {record.type === 'income' ? 
                              <TrendingUp className="h-4 w-4 text-green-600" /> : 
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            }
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{record.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              ยื่นโดย: {record.brokerName} | {record.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">จำนวนเงิน:</span>
                            <div className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {record.type === 'income' ? '+' : '-'}฿{record.amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">วิธีการจ่าย:</span>
                            <div className="font-medium text-foreground">{record.paymentMethod}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">เลขอ้างอิง:</span>
                            <div className="font-medium text-foreground">{record.invoiceRef}</div>
                          </div>
                        </div>
                      </div>
                      
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 ml-4">
                        รออนุมัติ
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(record.id)}
                        className="bg-gradient-success hover:opacity-90 text-white flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        อนุมัติ
                      </Button>
                      <Button
                        onClick={() => handleReject(record.id)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        ปฏิเสธ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Approved Records */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              รายการที่อนุมัติแล้ว
            </h2>
            
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-foreground">วันที่</th>
                        <th className="text-left p-3 font-medium text-foreground">รายการ</th>
                        <th className="text-right p-3 font-medium text-foreground">จำนวน</th>
                        <th className="text-center p-3 font-medium text-foreground">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedRecords.map((record) => (
                        <tr key={record.id} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="p-3 text-foreground">{record.date}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {record.type === 'income' ? 
                                <TrendingUp className="h-4 w-4 text-green-600" /> : 
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              }
                              <span className="text-foreground">{record.description}</span>
                            </div>
                          </td>
                          <td className={`p-3 text-right font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {record.type === 'income' ? '+' : '-'}฿{record.amount.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              อนุมัติแล้ว
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;